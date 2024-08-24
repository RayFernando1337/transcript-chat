'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Send } from "lucide-react"
import { parseSRT } from '@/utils/srtParser'

export default function TranscriptChat() {
  const [transcript, setTranscript] = useState('')
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'system',
        role: 'system',
        content: `You are an AI assistant that answers questions based on the following transcript: ${transcript}. If the question cannot be answered based on the transcript, politely say so.`
      }
    ],
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const parsedTranscript = parseSRT(content)
        setTranscript(parsedTranscript)
      }
      reader.readAsText(file)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat with Your Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept=".srt"
              onChange={handleFileUpload}
              className="hidden"
              id="transcript-upload"
            />
            <Button asChild>
              <label htmlFor="transcript-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload SRT File
              </label>
            </Button>
            {transcript && <span className="text-sm text-green-500">SRT file uploaded!</span>}
          </div>
          <ScrollArea className="h-[400px] border rounded-md p-4">
            {messages.map(m => (
              <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {m.content}
                </span>
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about your transcript..."
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}