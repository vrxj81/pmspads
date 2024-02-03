import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateContactDto, UpdateContactDto } from '@pmspads/api-domain-dtos';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private readonly contactRepository: Repository<Contact>,
    private readonly mailserService: MailerService
  ) {}

  findAll(options?: FindManyOptions<Contact>): Promise<Contact[]> {
    return this.contactRepository.find(options);
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({where: {id}});
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }
    return contact;
  }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    await this.mailserService.sendMail({
      from: contact.email,
      subject: contact.subject,
      text: contact.message
    });
    return this.contactRepository.save(contact);
  }

  async update(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactRepository.preload({
      id,
      ...updateContactDto
    });
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }
    return this.contactRepository.save(contact);
  }

  async delete(id: string): Promise<string> {
    const contact = await this.findOne(id);
    await this.contactRepository.remove(contact);
    return id;
  }
}
