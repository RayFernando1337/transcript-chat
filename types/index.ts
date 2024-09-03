export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatAPIRequest {
  messages: Message[];
  transcript: string;
}

export interface TranscriptEntry {
  text: string;
  duration: number;
  offset: number;
}

export interface YouTubeTranscriptRequest {
  videoId: string;
}