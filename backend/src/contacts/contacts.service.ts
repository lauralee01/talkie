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
        return this.prisma.contact.create({
            data: {
                name: input.name,
                phoneNumber: input.phoneNumber,
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