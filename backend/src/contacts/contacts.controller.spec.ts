jest.mock('./contacts.service', () => ({
  ContactsService: class ContactsService {},
}));

import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

describe('ContactsController', () => {
  const contactsService = {
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue([]),
  } as unknown as ContactsService;

  const controller = new ContactsController(contactsService);

  it('lists contacts', async () => {
    await expect(controller.findAll()).resolves.toEqual([]);
    expect(contactsService.findAll).toHaveBeenCalled();
  });

  it('creates contacts', async () => {
    await controller.create({
      name: 'Mom',
      phoneNumber: '+12055551234',
    });

    expect(contactsService.create).toHaveBeenCalledWith({
      name: 'Mom',
      phoneNumber: '+12055551234',
    });
  });
});
