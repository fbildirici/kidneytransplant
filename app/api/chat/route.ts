import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Return mock response when no API key
      return NextResponse.json({
        message: {
          role: "assistant",
          content:
            "Şu anda AI servisi yapılandırılmamış. Lütfen OPENAI_API_KEY ayarlayın. Demo modunda öneri sorularını kullanabilirsiniz.",
        },
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await response.json();

    return NextResponse.json({
      message: data.choices[0].message,
    });
  } catch {
    return NextResponse.json(
      { error: "AI yanıt veremedi. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
