const AUDIO_MIME_TYPES: Record<string, string> = {
  wav: 'audio/wav',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
};

export function getAudioMimeType(fileFormat: string): string {
  return (
    AUDIO_MIME_TYPES[fileFormat.toLowerCase()] ?? 'application/octet-stream'
  );
}
