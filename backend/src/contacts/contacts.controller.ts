import { Body, Controller, Post } from '@nestjs/common';
import { ContactsService } from './contacts.service';

type CreateContactBody = {
    name: string;
    phoneNumber: string;
};

@Controller('contacts')
export class ContactsController {
    constructor(
        private readonly contactsService: ContactsService,
    ) { }

    @Post()
    async create(
        @Body() body: CreateContactBody,
    ) {
        return this.contactsService.create({
            name: body.name,
            phoneNumber: body.phoneNumber,
        });
    }
}
