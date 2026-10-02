import { Injectable } from '@nestjs/common';
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
        return this.prisma.$transaction(async (prisma) => {
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