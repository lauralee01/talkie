import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
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
        try {
            return await this.prisma.$transaction(async (prisma) => {
                const contact = await prisma.contact.create({
                    data: {
                        name: input.name,
                        phoneNumber: input.phoneNumber,
                    },
                });

                await prisma.talkie.updateMany({
                    where: {
                        fromNumber: input.phoneNumber,
                        contactId: null,
                    },
                    data: {
                        contactId: contact.id,
                    },
                });

                return contact;
            });
        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === 'P2002'
            ) {
                throw new ConflictException(
                    'A contact with this phone number already exists.',
                );
            }

            throw error;
        }
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