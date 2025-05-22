import { useCallback, useRef, useState } from "react";
import { transcribeAudio } from "../services/transcriptionService";

export const useAudioRecorder = () => {
  const [state, setState] = useState<AudioState>({
    isRecording: false,
    audioUrl: null,
    loading: false,
    transcription: null,
    error: null,
    isDragOver: false,
    audioFileName: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioFileRef = useRef<Blob | null>(null);

  const updateState = useCallback((updates: Partial<AudioState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      updateState({ error: null });

      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent): void => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async (): Promise<void> => {
        updateState({ loading: true });

        const audioBlob: Blob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });

        audioFileRef.current = audioBlob;
        const url: string = URL.createObjectURL(audioBlob);

        updateState({
          audioUrl: url,
          audioFileName: "recording.webm",
        });

        try {
          const result = await transcribeAudio(audioBlob, "recording.webm");
          updateState({ transcription: result });
        } catch (error) {
          console.error("Transcription error:", error);
          updateState({
            error: "Failed to transcribe audio. Please try again.",
          });
        } finally {
          updateState({ loading: false });
        }
      };

      mediaRecorderRef.current.start(1000);
      updateState({ isRecording: true });
    } catch (err: unknown) {
      console.error("Microphone access error:", err);
      updateState({ error: "Microphone access is required." });
    }
  }, [updateState]);

  const stopRecording = useCallback((): void => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      updateState({ isRecording: false });

      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach((track) => track.stop());
    }
  }, [updateState]);

  const processUploadedFile = useCallback(
    async (file: File): Promise<void> => {
      updateState({
        error: null,
        loading: true,
      });

      audioFileRef.current = file;
      const url: string = URL.createObjectURL(file);

      updateState({
        audioUrl: url,
        audioFileName: file.name,
      });

      try {
        const result = await transcribeAudio(file, file.name);
        updateState({ transcription: result });
      } catch (error) {
        console.error("Transcription error:", error);
        updateState({ error: "Failed to transcribe audio. Please try again." });
      } finally {
        updateState({ loading: false });
      }
    },
    [updateState]
  );

  const retryTranscription = useCallback(async (): Promise<void> => {
    if (audioFileRef.current) {
      updateState({
        error: null,
        loading: true,
      });

      try {
        const result = await transcribeAudio(
          audioFileRef.current,
          state.audioFileName || undefined
        );
        updateState({ transcription: result });
      } catch (error) {
        console.error("Transcription error:", error);
        updateState({ error: "Failed to transcribe audio. Please try again." });
      } finally {
        updateState({ loading: false });
      }
    }
  }, [state.audioFileName, updateState]);

  const clearAll = useCallback((): void => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }

    audioFileRef.current = null;

    updateState({
      audioUrl: null,
      transcription: null,
      error: null,
      audioFileName: null,
    });
  }, [state.audioUrl, updateState]);

  return {
    state,
    actions: {
      startRecording,
      stopRecording,
      processUploadedFile,
      retryTranscription,
      clearAll,
      setDragOver: (isDragOver: boolean) => updateState({ isDragOver }),
      setError: (error: string | null) => updateState({ error }),
    },
  };
};
