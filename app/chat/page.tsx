import { Suspense } from "react";
import TranscriptChat from "@/components/TranscriptChat";

const ChatPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <TranscriptChat />
  </Suspense>
);

export default ChatPage;
