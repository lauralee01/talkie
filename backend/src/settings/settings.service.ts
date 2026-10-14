import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

export const DEFAULT_SETTINGS_ID = 'default';

export type CallFlowSettings = {
  id: string;
  welcomePrompt: string;
  recordPrompt: string;
  invalidOptionPrompt: string;
  goodbyePrompt: string;
  maxRecordingSeconds: number;
  updatedAt: Date;
};

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<CallFlowSettings> {
    return this.prisma.talkieSettings.upsert({
      where: { id: DEFAULT_SETTINGS_ID },
      update: {},
      create: { id: DEFAULT_SETTINGS_ID },
    });
  }

  async update(input: UpdateSettingsDto): Promise<CallFlowSettings> {
    await this.get();

    return this.prisma.talkieSettings.update({
      where: { id: DEFAULT_SETTINGS_ID },
      data: {
        ...(input.welcomePrompt !== undefined
          ? { welcomePrompt: input.welcomePrompt.trim() }
          : {}),
        ...(input.recordPrompt !== undefined
          ? { recordPrompt: input.recordPrompt.trim() }
          : {}),
        ...(input.invalidOptionPrompt !== undefined
          ? { invalidOptionPrompt: input.invalidOptionPrompt.trim() }
          : {}),
        ...(input.goodbyePrompt !== undefined
          ? { goodbyePrompt: input.goodbyePrompt.trim() }
          : {}),
        ...(input.maxRecordingSeconds !== undefined
          ? { maxRecordingSeconds: input.maxRecordingSeconds }
          : {}),
      },
    });
  }
}
