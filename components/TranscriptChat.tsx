"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Send, MessageCircle } from "lucide-react";
import { parseSRT } from "@/utils/srtParser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { ThemeToggle } from "./ThemeToggle";
import { Message } from "@/types";

const TranscriptChat = () => {
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isChatInputVisible, setIsChatInputVisible] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Switch to chat tab if not already active
    setActiveTab("chat");

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
      scrollToBottom();
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

  const isTranscriptUploaded = useMemo(() => transcript.length > 0, [transcript]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const renderMessage = useCallback((m: Message) => (
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
  ), []);

  const toggleChatInput = useCallback(() => {
    setIsChatInputVisible(prev => !prev);
  }, []);

  const hasContent = useMemo(() => messages.length > 0 || transcript.length > 0, [messages, transcript]);

  return (
    <Card className="w-full h-full max-w-4xl mx-auto bg-card text-card-foreground flex flex-col relative">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg">Chat with Your Transcript</CardTitle>
        <ThemeToggle />
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-4">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept=".srt"
              onChange={handleFileUpload}
              className="hidden"
              id="transcript-upload"
            />
            <Button asChild variant="secondary" className="w-full">
              <label htmlFor="transcript-upload" className="cursor-pointer flex items-center justify-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload SRT File
              </label>
            </Button>
          </div>
          {isTranscriptUploaded && <span className="text-sm text-primary">SRT file uploaded!</span>}
          {hasContent && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
              <TabsList className="bg-muted text-muted-foreground">
                <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="flex-grow overflow-hidden">
                <ScrollArea className="h-full border rounded-md p-4 bg-card">
                  {messages.map(renderMessage)}
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="transcript" className="flex-grow overflow-hidden">
                <ScrollArea className="h-full border rounded-md p-4 bg-card">
                  <pre className="whitespace-pre-wrap text-sm">{transcript}</pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
          {!hasContent && (
            <div className="flex-grow flex items-center justify-center text-muted-foreground">
              Upload a transcript to start chatting
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Floating Action Button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full p-0 w-12 h-12 shadow-lg md:hidden"
        onClick={toggleChatInput}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Input */}
      <div className={`fixed bottom-0 left-0 right-0 bg-background p-4 transition-transform duration-300 ease-in-out ${isChatInputVisible ? 'translate-y-0' : 'translate-y-full'} md:relative md:transform-none md:p-4`}>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className="flex-grow bg-input text-foreground"
          />
          <Button type="submit" disabled={isLoading} variant="default">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default TranscriptChat;