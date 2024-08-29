export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatAPIRequest {
  messages: Message[];
  transcript: string;
}