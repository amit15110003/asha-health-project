import { createClient } from "@deepgram/sdk";
import { NextRequest, NextResponse } from "next/server";

const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // Transcribe the audio
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        model: "nova-2",
        language: "en-US",
        smart_format: true,
        punctuate: true,
        paragraphs: true,
        diarize: true,
        numerals: true,
        dates: true,
        times: true,
        // Medical-specific options
        keywords: [
          "patient",
          "diagnosis",
          "treatment",
          "medication",
          "symptoms",
        ],
        search: ["patient care", "medical history", "vital signs"],
      }
    );

    if (error) {
      console.error("Deepgram error:", error);
      return NextResponse.json(
        { error: "Transcription failed" },
        { status: 500 }
      );
    }

    const channel = result.results.channels[0];
    const alternative = channel.alternatives[0];
    const transcript = alternative.transcript;
    const confidence = alternative.confidence;
    const words = alternative.words;

    // Extract speaker information
    const speakers = new Set<number>();
    const speakerSegments: Array<{
      speaker: number;
      text: string;
      start: number;
      end: number;
    }> = [];

    // Collect unique speakers and create segments
    if (words && words.length > 0) {
      words.forEach((word) => {
        if (word.speaker !== undefined) {
          speakers.add(word.speaker);
        }
      });

      // Group consecutive words by speaker
      let currentSpeaker = words[0]?.speaker;
      let currentSegment = "";
      let segmentStart = words[0]?.start || 0;
      let segmentEnd = words[0]?.end || 0;

      words.forEach((word) => {
        if (word.speaker === currentSpeaker) {
          currentSegment += (currentSegment ? " " : "") + word.word;
          segmentEnd = word.end || segmentEnd;
        } else {
          // Save previous segment
          if (currentSpeaker !== undefined) {
            speakerSegments.push({
              speaker: currentSpeaker,
              text: currentSegment,
              start: segmentStart,
              end: segmentEnd,
            });
          }

          // Start new segment
          currentSpeaker = word.speaker;
          currentSegment = word.word;
          segmentStart = word.start || 0;
          segmentEnd = word.end || 0;
        }
      });

      // Don't forget the last segment
      if (currentSpeaker !== undefined && currentSegment) {
        speakerSegments.push({
          speaker: currentSpeaker,
          text: currentSegment,
          start: segmentStart,
          end: segmentEnd,
        });
      }
    }

    const speakerCount = speakers.size;
    const speakerList = Array.from(speakers).sort((a, b) => a - b);

    return NextResponse.json({
      transcript,
      confidence,
      words,
      // Speaker information
      speakerCount,
      speakers: speakerList,
      speakerSegments,
      // Original metadata
      metadata: {
        duration: result.metadata.duration,
        channels: result.metadata.channels,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
