import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaService();

async function main() {
    const contact = await prisma.contact.findFirst({
        where: {
            name: 'Laura',
        },
    });

    if (!contact) {
        throw new Error('Laura contact was not found');
    }

    const result = await prisma.talkie.updateMany({
        where: {
            fromNumber: contact.phoneNumber,
            contactId: null,
        },
        data: {
            contactId: contact.id,
        },
    });

    console.log(
        `Backfilled ${result.count} Talkies for ${contact.name}.`,
    );
}

main()
    .catch((error) => {
        console.error('Backfill failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });