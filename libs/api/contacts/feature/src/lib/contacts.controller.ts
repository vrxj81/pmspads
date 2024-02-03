import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Contact, ContactsService } from '@pmspads/api-contacts-data-access';
import { CreateContactDto, UpdateContactDto } from '@pmspads/api-domain-dtos';

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService
  ) {}

  @Get('')
  findAll(@Query() options?: never): Promise<Contact[]> {
    return this.contactsService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.findOne(id);
  }

  @Post('')
  create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactsService.create(createContactDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<string> {
    return this.contactsService.delete(id);
  }
}
