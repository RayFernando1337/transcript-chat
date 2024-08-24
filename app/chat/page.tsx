import { Suspense } from 'react'
import TranscriptChat from '@/components/TranscriptChat'

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranscriptChat />
    </Suspense>
  )
}