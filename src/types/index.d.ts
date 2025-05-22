interface TranscriptionResult {
  transcript: string;
  confidence: number;
  words: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
  metadata: {
    duration: number;
    channels: number;
  };
  speakerCount: number;
  speakerSegments: {
    speaker: string;
    text: string;
    start: number;
    end: number;
  }[];
  speakers: string[];
}

interface AudioRecorderState {
  isRecording: boolean;
  audioUrl: string | null;
  loading: boolean;
  transcription: TranscriptionResult | null;
  error: string | null;
}

interface MediaRecorderConfig {
  audio: {
    sampleRate: number;
    channelCount: number;
    echoCancellation: boolean;
    noiseSuppression: boolean;
  };
}

const DEFAULT_MEDIA_CONFIG: MediaRecorderConfig = {
  audio: {
    sampleRate: 16000,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
  },
};

interface AudioState {
  isRecording: boolean;
  audioUrl: string | null;
  loading: boolean;
  transcription: TranscriptionResult | null;
  error: string | null;
  isDragOver: boolean;
  audioFileName: string | null;
}
interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

interface ISoapResponse {
  patient_info?: {
    name?: string;
    date_of_birth?: string;
    age?: string | number;
    preferred_pharmacy?: string;
    emergency_contact?: {
      name?: string;
      phone?: string;
    };
    insurance?: {
      provider?: string;
      primary_holder?: string;
    };
  };
  soap_note?: {
    S?: string;
    O?: string;
    A?: string;
    P?: string;
  };
}
