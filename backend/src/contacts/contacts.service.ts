import { BadRequestException, Injectable } from '@nestjs/common';
import { normalizePhoneNumber } from '../common/utils/phone-number';
import { PrismaService } from '../prisma/prisma.service';

type CreateContactInput = {
    name: string;
    phoneNumber: string;
};

@Injectable()
export class ContactsService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(input: CreateContactInput) {
        const phoneNumber = normalizePhoneNumber(input.phoneNumber);

        if (!phoneNumber) {
            throw new BadRequestException(
                'Please enter a valid phone number in international format, starting with +.',
            );
        }

        return this.prisma.$transaction(async (prisma) => {
            const contact = await prisma.contact.create({
                data: {
                    name: input.name,
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
    }

    async backfillTalkiesForContact(
        contactId: string,
        phoneNumber: string,
    ) {
        return this.prisma.talkie.updateMany({
            where: {
                fromNumber: phoneNumber,
                contactId: null,
            },
            data: {
                contactId,
            },
        });
    }

    async findAll() {
        return this.prisma.contact.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findByPhoneNumber(phoneNumber: string) {
        return this.prisma.contact.findUnique({
            where: {
                phoneNumber,
            },
        });
    }
}