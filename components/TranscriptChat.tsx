"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Send } from "lucide-react";
import { parseSRT } from "@/utils/srtParser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { ThemeToggle } from "./ThemeToggle";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const TranscriptChat = () => {
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    console.log('Sending transcript:', transcript.substring(0, 100) + '...'); // Log first 100 chars of transcript

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], transcript }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      // Add an initial assistant message
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            const updatedLastMessage = {
              ...lastMessage,
              content: lastMessage.content + chunk
            };
            return [...prev.slice(0, -1), updatedLastMessage];
          });
        }
      }
    } catch (error) {
      console.error('Error details:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: `Sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const parsedTranscript = parseSRT(content);
        setTranscript(parsedTranscript);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Chat with Your Transcript</CardTitle>
        <ThemeToggle />
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
            <Button asChild variant="secondary">
              <label htmlFor="transcript-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload SRT File
              </label>
            </Button>
            {transcript && <span className="text-sm text-primary">SRT file uploaded!</span>}
          </div>
          <Tabs defaultValue="chat">
            <TabsList className="bg-muted text-muted-foreground">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              <ScrollArea className="h-[400px] border rounded-md p-4 bg-card">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {m.role === "user" ? (
                        m.content
                      ) : (
                        <ReactMarkdown
                          className="markdown-content prose prose-sm max-w-none"
                          components={{
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc pl-4" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol className="list-decimal pl-4" {...props} />
                            ),
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      )}
                    </span>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="transcript">
              <ScrollArea className="h-[400px] border rounded-md p-4 bg-card">
                <pre className="whitespace-pre-wrap">{transcript}</pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about your transcript..."
            className="flex-grow bg-input text-foreground"
          />
          <Button type="submit" disabled={isLoading} variant="default">
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default TranscriptChat;