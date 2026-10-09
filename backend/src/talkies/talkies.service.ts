import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class TalkiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly talkiesEventsService: TalkiesEventsService,
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
      select: {
        id: true,
        fromNumber: true,
        toNumber: true,
        durationSeconds: true,
        fileFormat: true,
        status: true,
        createdAt: true,
        contact: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.talkie.findUnique({
      where: { id },
    });
  }
}
