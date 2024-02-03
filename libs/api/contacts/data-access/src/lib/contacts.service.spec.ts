import { Test } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { faker } from '@faker-js/faker';
import { CreateContactDto } from '@pmspads/api-domain-dtos';
import { IContact } from '@pmspads/domain-interfaces';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

describe('ContactsService', () => {
  let service: ContactsService;

  const id: string = faker.string.uuid();

  const contactDto: CreateContactDto = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    subject: faker.lorem.sentence(),
    message: faker.lorem.paragraph()
  }

  const expectedContact: IContact = {
    id,
    ...contactDto,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }

  const expectedContacts: IContact[] = [expectedContact];

  const mockRepository = {
    find: jest.fn().mockResolvedValue(expectedContacts),
    findOne: jest.fn().mockResolvedValue(expectedContact),
    create: jest.fn().mockResolvedValue(expectedContact),
    save: jest.fn().mockResolvedValue(expectedContact),
    preload: jest.fn().mockResolvedValue(expectedContact),
    remove: jest.fn().mockResolvedValue(id),
  }

  const mockMailerService = {
    sendMail: jest.fn(),
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ContactsService,
        {provide: MailerService, useValue: mockMailerService }
      ],
    }).useMocker((token) => {
      if (token === getRepositoryToken(Contact)) {
        return mockRepository;
      }
      return;
    }).compile();

    service = module.get(ContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
  describe('findAll', () => {
    it('should return all contact form submissions', async () => {
      const result = await service.findAll();
      expect(result).toEqual(expectedContacts);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should return a contact form submission by id', async () => {
      const result = await service.findOne(id);
      expect(result).toEqual(expectedContact);
      expect(mockRepository.findOne).toHaveBeenCalled();
    });
    it('should throw a NotFoundException', async () => {
      try {
        await service.findOne(faker.string.uuid());
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('create', () => {
    it('should create a contact submission, send an email and return the submission', async () => {
      const result = await service.create(contactDto);
      expect(result).toEqual(expectedContact);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });
  });
  describe('update', () => {
    it('should update and return a contact submission', async () => {
      const result = await service.update(id, contactDto);
      expect(result).toEqual(expectedContact);
      expect(mockRepository.preload).toHaveBeenCalled();
    });
    it('should throw a NotFoundException', async () => {
      try {
        await service.update(faker.string.uuid(), contactDto);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('delete', () => {
    it('should delete a contact submission and return it\'s id', async () => {
      const result = await service.delete(id);
      expect(result).toEqual(id);
      expect(mockRepository.remove).toHaveBeenCalled();
    });
    it('should throw a NotFoundException', async () => {
      try {
        await service.delete(faker.string.uuid());
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
