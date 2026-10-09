export type BandwidthRecordingAvailableEvent = {
  callId: string;
  recordingId: string;
  from: string;
  to: string;
  fileFormat: string;
  duration?: string;
};

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

export function parseRecordingAvailableEvent(
  body: Record<string, unknown>,
): BandwidthRecordingAvailableEvent | null {
  const callId = readString(body.callId);
  const recordingId = readString(body.recordingId);
  const from = readString(body.from);
  const to = readString(body.to);
  const fileFormat = readString(body.fileFormat);
  const duration = readString(body.duration) ?? undefined;

  if (!callId || !recordingId || !from || !to || !fileFormat) {
    return null;
  }

  return {
    callId,
    recordingId,
    from,
    to,
    fileFormat,
    duration,
  };
}
