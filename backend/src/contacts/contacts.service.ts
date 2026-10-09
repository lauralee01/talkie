import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { normalizePhoneNumber } from '../common/utils/phone-number';
import { isPrismaUniqueConstraintError } from '../common/utils/prisma-errors';
import { PrismaService } from '../prisma/prisma.service';

type CreateContactInput = {
  name: string;
  phoneNumber: string;
};

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateContactInput) {
    const phoneNumber = normalizePhoneNumber(input.phoneNumber);

    if (!phoneNumber) {
      throw new BadRequestException('Invalid phone number.');
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const contact = await prisma.contact.create({
          data: {
            name: input.name.trim(),
            phoneNumber,
          },
        });

        await prisma.talkie.updateMany({
          where: {
            fromNumber: phoneNumber,
            contactId: null,
          },
          data: {
            contactId: contact.id,
          },
        });

        return contact;
      });
    } catch (error) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new ConflictException(
          'A contact with this phone number already exists.',
        );
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findByPhoneNumber(phoneNumber: string) {
    const normalized = normalizePhoneNumber(phoneNumber) ?? phoneNumber;

    return this.prisma.contact.findUnique({
      where: { phoneNumber: normalized },
    });
  }
}
