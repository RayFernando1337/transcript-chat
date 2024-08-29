import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from 'next/server';
import { ChatAPIRequest } from '@/types';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, transcript }: ChatAPIRequest = await req.json();

    const prompt = `You are an AI assistant that answers questions based on the following transcript:

${transcript}

Please analyze the transcript and answer the user's questions. If the question cannot be answered based on the transcript, politely say so and explain why.`;

    const { textStream } = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: prompt },
        ...messages,
      ],
      maxTokens: 2000,
      temperature: 0.2,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    });

    return new Response(textStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
