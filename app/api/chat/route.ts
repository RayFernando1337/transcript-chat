import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, transcript } = await req.json()

  const prompt = `You are an AI assistant that answers questions based on the following transcript:

${transcript}

Please analyze the transcript and answer the user's questions. If the question cannot be answered based on the transcript, politely say so and explain why.`

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      { role: 'system', content: prompt },
      ...messages.map((message: any) => ({
        role: message.role,
        content: message.content,
      })),
    ],
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  
  // Respond with the stream
  return new StreamingTextResponse(stream)
}