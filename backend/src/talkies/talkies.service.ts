import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type CreateTalkieInput = {
    callId: string;
    recordingId: string;
    fromNumber: string;
    toNumber: string;
    durationSeconds: number;
    fileFormat: string;
    audioPath: string;
    status: string;
};

@Injectable()
export class TalkiesService {
    constructor(private readonly prisma: PrismaService) { }

    async upsert(input: CreateTalkieInput) {
        return this.prisma.talkie.upsert({
            where: {
                recordingId: input.recordingId,
            },
            update: {
                callId: input.callId,
                fromNumber: input.fromNumber,
                toNumber: input.toNumber,
                durationSeconds: input.durationSeconds,
                fileFormat: input.fileFormat,
                audioPath: input.audioPath,
                status: input.status,
            },
            create: input,
        });
    }

    async findAll() {
        return this.prisma.talkie.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}