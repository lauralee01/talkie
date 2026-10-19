import { Injectable, NotFoundException } from '@nestjs/common';
import { isPrismaNotFoundError } from '../common/utils/prisma-errors';
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

  async findPage(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.talkie.findMany({
        select: talkieListSelect,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.talkie.count(),
    ]);

    return {
      items,
      page,
      pageSize,
      total,
      hasMore: skip + items.length < total,
    };
  }

  findById(id: string) {
    return this.prisma.talkie.findUnique({
      where: { id },
    });
  }

  async markListened(id: string) {
    try {
      return await this.prisma.talkie.update({
        where: { id },
        data: { listenedAt: new Date() },
        select: talkieListSelect,
      });
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException('Talkie not found');
      }

      throw error;
    }
  }

  async markAllListened() {
    const result = await this.prisma.talkie.updateMany({
      where: { listenedAt: null },
      data: { listenedAt: new Date() },
    });

    return { updatedCount: result.count };
  }

  async markUnread(id: string) {
    try {
      return await this.prisma.talkie.update({
        where: { id },
        data: { listenedAt: null },
        select: talkieListSelect,
      });
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException('Talkie not found');
      }

      throw error;
    }
  }

  async delete(id: string) {
    try {
      const talkie = await this.prisma.talkie.delete({
        where: { id },
      });

      await this.recordingsStorage.delete(talkie.audioPath);
      this.talkiesEventsService.notifyNewTalkie();
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException('Talkie not found');
      }

      throw error;
    }
  }
}
