import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordingsStorageService } from '../recordings/recordings-storage.service';
import { TalkiesEventsService } from './talkies-events.service';

export type UpsertTalkieInput = {
  callId: string;
  recordingId: string;
  fromNumber: string;
  toNumber: string;
  durationSeconds: number;
  fileFormat: string;
  audioPath: string;
  status: string;
  contactId?: string;
};

const talkieListSelect = {
  id: true,
  fromNumber: true,
  toNumber: true,
  durationSeconds: true,
  fileFormat: true,
  status: true,
  listenedAt: true,
  createdAt: true,
  contact: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

@Injectable()
export class TalkiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly talkiesEventsService: TalkiesEventsService,
    private readonly recordingsStorage: RecordingsStorageService,
  ) {}

  async upsert(input: UpsertTalkieInput) {
    const talkie = await this.prisma.talkie.upsert({
      where: { recordingId: input.recordingId },
      update: { ...input },
      create: { ...input },
    });

    this.talkiesEventsService.notifyNewTalkie();

    return talkie;
  }

  findAll() {
    return this.prisma.talkie.findMany({
      select: talkieListSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.talkie.findUnique({
      where: { id },
    });
  }

  async markListened(id: string) {
    const talkie = await this.findById(id);

    if (!talkie) {
      throw new NotFoundException('Talkie not found');
    }

    if (talkie.listenedAt) {
      return this.prisma.talkie.findUniqueOrThrow({
        where: { id },
        select: talkieListSelect,
      });
    }

    return this.prisma.talkie.update({
      where: { id },
      data: { listenedAt: new Date() },
      select: talkieListSelect,
    });
  }

  async delete(id: string) {
    const talkie = await this.findById(id);

    if (!talkie) {
      throw new NotFoundException('Talkie not found');
    }

    await this.prisma.talkie.delete({
      where: { id },
    });

    await this.recordingsStorage.delete(talkie.audioPath);
    this.talkiesEventsService.notifyNewTalkie();
  }
}
