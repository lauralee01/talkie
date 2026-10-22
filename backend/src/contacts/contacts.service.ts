import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { normalizePhoneNumber } from '../common/utils/phone-number';
import { isPrismaUniqueConstraintError } from '../common/utils/prisma-errors';
import { PrismaService } from '../prisma/prisma.service';
import { TalkiesEventsService } from '../talkies/talkies-events.service';

type ContactInput = {
  name: string;
  phoneNumber: string;
};

const contactTalkieSelect = {
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
export class ContactsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly talkiesEventsService: TalkiesEventsService,
  ) {}

  async create(input: ContactInput) {
    const phoneNumber = this.requirePhoneNumber(input.phoneNumber);

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const contact = await prisma.contact.create({
          data: {
            name: input.name.trim(),
            phoneNumber,
          },
        });

        await this.linkTalkiesByPhone(prisma, contact.id, phoneNumber);

        return contact;
      });
    } catch (error) {
      this.rethrowUniqueConflict(error);
    }
  }

  findAll() {
    return this.prisma.contact.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { talkies: true },
        },
      },
    });
  }

  async findById(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        talkies: {
          select: contactTalkieSelect,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { talkies: true },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  findByPhoneNumber(phoneNumber: string) {
    const normalized = normalizePhoneNumber(phoneNumber) ?? phoneNumber;

    return this.prisma.contact.findUnique({
      where: { phoneNumber: normalized },
    });
  }

  async update(id: string, input: ContactInput) {
    const existing = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Contact not found');
    }

    const phoneNumber = this.requirePhoneNumber(input.phoneNumber);

    try {
      const contact = await this.prisma.$transaction(async (prisma) => {
        const updated = await prisma.contact.update({
          where: { id },
          data: {
            name: input.name.trim(),
            phoneNumber,
          },
        });

        if (phoneNumber !== existing.phoneNumber) {
          await this.unlinkTalkiesNotMatchingPhone(
            prisma,
            updated.id,
            phoneNumber,
          );
          await this.linkTalkiesByPhone(prisma, updated.id, phoneNumber);
        }

        return updated;
      });

      if (phoneNumber !== existing.phoneNumber) {
        this.talkiesEventsService.notifyNewTalkie();
      }

      return contact;
    } catch (error) {
      this.rethrowUniqueConflict(error);
    }
  }

  async delete(id: string) {
    const existing = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Contact not found');
    }

    await this.prisma.contact.delete({
      where: { id },
    });
  }

  private requirePhoneNumber(value: string): string {
    const phoneNumber = normalizePhoneNumber(value);

    if (!phoneNumber) {
      throw new BadRequestException('Invalid phone number.');
    }

    return phoneNumber;
  }

  private async unlinkTalkiesNotMatchingPhone(
    prisma: Pick<PrismaService, 'talkie'>,
    contactId: string,
    phoneNumber: string,
  ) {
    await prisma.talkie.updateMany({
      where: {
        contactId,
        NOT: { fromNumber: phoneNumber },
      },
      data: {
        contactId: null,
      },
    });
  }

  private async linkTalkiesByPhone(
    prisma: Pick<PrismaService, 'talkie'>,
    contactId: string,
    phoneNumber: string,
  ) {
    await prisma.talkie.updateMany({
      where: {
        fromNumber: phoneNumber,
        contactId: null,
      },
      data: {
        contactId,
      },
    });
  }

  private rethrowUniqueConflict(error: unknown): never {
    if (isPrismaUniqueConstraintError(error)) {
      throw new ConflictException(
        'A contact with this phone number already exists.',
      );
    }

    throw error;
  }
}
