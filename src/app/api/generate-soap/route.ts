import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a medical assistant that extracts structured patient information and generates detailed SOAP (Subjective, Objective, Assessment, Plan) notes from conversation transcripts between patients and medical staff.

IMPORTANT: Return ONLY valid JSON without any markdown formatting, backticks, or additional text. The response must be parseable JSON.

Return the output in the following JSON format:
{
  "patient_info": {
    "name": "Full Name",
    "date_of_birth": "YYYY-MM-DD",
    "age": "Age in years",
    "emergency_contact": {
      "name": "Contact Name",
      "phone": "Phone Number"
    },
    "insurance": {
      "provider": "Insurance Name",
      "primary_holder": "Patient or Spouse"
    },
    "preferred_pharmacy": "Pharmacy Name"
  },
  "soap_note": {
    "S": "Detailed subjective information from patient...",
    "O": "Objective observations and measurements...",
    "A": "Assessment and clinical reasoning...",
    "P": "Plan for treatment and follow-up..."
  }
}`,
          },
          {
            role: "user",
            content: `Extract patient info and generate a SOAP note from this consultation transcript:\n\n${transcript}`,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON output
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const soapContent = data.choices?.[0]?.message?.content;

    if (!soapContent) {
      throw new Error("No content received from OpenAI");
    }

    // Parse the JSON response from OpenAI
    let parsedSoap;
    try {
      // Clean the response in case there are any markdown backticks
      const cleanedContent = soapContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedSoap = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw content:", soapContent);

      // Return a structured error response
      return NextResponse.json(
        {
          error: "Failed to parse SOAP response",
          rawContent: soapContent,
        },
        { status: 500 }
      );
    }

    // Validate the structure
    if (!parsedSoap.patient_info || !parsedSoap.soap_note) {
      return NextResponse.json(
        {
          error: "Invalid SOAP structure received",
          receivedData: parsedSoap,
        },
        { status: 500 }
      );
    }

    // Return the parsed JSON directly
    return NextResponse.json({
      success: true,
      soap: parsedSoap,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
