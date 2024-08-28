import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, transcript }: { messages: Message[], transcript: string } = await req.json();

    console.log('Received transcript:', transcript.substring(0, 100) + '...'); // Log first 100 chars of transcript

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
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
