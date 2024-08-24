export function parseSRT(srtContent: string): string {
  const lines = srtContent.split('\n')
  let transcript = ''
  let isSubtitle = false

  for (const line of lines) {
    if (line.trim() === '') {
      isSubtitle = false
    } else if (!isNaN(Number(line.trim()))) {
      // This is a subtitle number, skip it
      continue
    } else if (line.includes('-->')) {
      // This is a timestamp, skip it
      continue
    } else {
      isSubtitle = true
    }

    if (isSubtitle) {
      transcript += line.trim() + ' '
    }
  }

  return transcript.trim()
}