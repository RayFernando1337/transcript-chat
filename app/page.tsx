import TranscriptChat from "@/components/TranscriptChat";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <TranscriptChat />
    </div>
  );
}
