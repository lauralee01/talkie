import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';


@Controller('contacts')
export class ContactsController {
    constructor(
        private readonly contactsService: ContactsService,
    ) { }

    @Post()
    async create(
        @Body() body: CreateContactDto,
    ) {
        return this.contactsService.create({
            name: body.name,
            phoneNumber: body.phoneNumber,
        });
    }

    @Get()
    async findAll() {
        return this.contactsService.findAll();
    }

    @Get('phone/:phoneNumber')
    async findByPhoneNumber(
        @Param('phoneNumber') phoneNumber: string,
    ) {
        console.log('Looking up contact with:', phoneNumber);

        const contact =
            await this.contactsService.findByPhoneNumber(phoneNumber);

        console.log('Contact found:', contact);

        return contact;
    }
}
