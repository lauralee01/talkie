import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/talkies/audio-player";
import { formatTalkieDate } from "@/lib/format";
import type { Talkie } from "@/lib/talkies-api";

type TalkieCardProps = {
  talkie: Talkie;
};

export function TalkieCard({ talkie }: TalkieCardProps) {
  return (
    <Card as="article">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">From</p>
          <p className="mt-1 font-medium text-zinc-950">
            {talkie.contact?.name ?? talkie.fromNumber}
          </p>
        </div>

        <time dateTime={talkie.createdAt} className="text-sm text-zinc-500">
          {formatTalkieDate(talkie.createdAt)}
        </time>
      </div>

      <AudioPlayer talkieId={talkie.id} />
    </Card>
  );
}
