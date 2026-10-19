import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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
export class SettingsService implements OnModuleInit {
  private readonly logger = new Logger(SettingsService.name);
  private cache: CallFlowSettings | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureDefaults();
  }

  async get(): Promise<CallFlowSettings> {
    if (this.cache) {
      return this.cache;
    }

    const settings = await this.prisma.talkieSettings.findUnique({
      where: { id: DEFAULT_SETTINGS_ID },
    });

    if (settings) {
      this.cache = settings;
      return settings;
    }

    return this.ensureDefaults();
  }

  async update(input: UpdateSettingsDto): Promise<CallFlowSettings> {
    await this.get();

    const updated = await this.prisma.talkieSettings.update({
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

    this.cache = updated;
    return updated;
  }

  private async ensureDefaults(): Promise<CallFlowSettings> {
    const settings = await this.prisma.talkieSettings.upsert({
      where: { id: DEFAULT_SETTINGS_ID },
      update: {},
      create: { id: DEFAULT_SETTINGS_ID },
    });

    this.cache = settings;
    this.logger.log('Call-flow settings ready');
    return settings;
  }
}
