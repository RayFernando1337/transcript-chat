"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Send } from "lucide-react";
import { parseSRT } from "@/utils/srtParser";
import ReactMarkdown from "react-markdown";
import { Message } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TranscriptChat = () => {
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], transcript }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...lastMessage, content: lastMessage.content + chunk }];
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
  }, [messages, transcript, input, isLoading]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTranscript(parseSRT(content));
      };
      reader.readAsText(file);
    }
  }, []);

  const renderMessage = useCallback((m: Message) => (
    <div key={m.id} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
      <span className={`inline-block p-2 rounded-lg ${
        m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      }`}>
        {m.role === "user" ? (
          m.content
        ) : (
          <ReactMarkdown className="markdown-content prose prose-sm max-w-none">
            {m.content}
          </ReactMarkdown>
        )}
      </span>
    </div>
  ), []);

  return (
    <div className="flex flex-col h-full">
      {!transcript ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to Transcript Chat</h2>
          <p className="mb-6">Upload an SRT file to start chatting with your transcript.</p>
          <Input
            type="file"
            accept=".srt"
            onChange={handleFileUpload}
            className="hidden"
            id="transcript-upload"
          />
          <Button asChild variant="default" size="lg">
            <label htmlFor="transcript-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload SRT File
            </label>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="chat" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-grow flex flex-col">
            <ScrollArea className="flex-grow p-4">
              {messages.map(renderMessage)}
            </ScrollArea>
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask a question..."
                  className="flex-grow"
                />
                <Button type="submit" disabled={isLoading} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
          <TabsContent value="transcript" className="flex-grow">
            <ScrollArea className="h-full p-4">
              <pre className="whitespace-pre-wrap">{transcript}</pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TranscriptChat;