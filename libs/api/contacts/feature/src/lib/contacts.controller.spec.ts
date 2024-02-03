import { Test } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { CreateContactDto } from '@pmspads/api-domain-dtos';
import { IContact } from '@pmspads/domain-interfaces';
import { faker } from '@faker-js/faker';
import { Contact, ContactsService } from '@pmspads/api-contacts-data-access';
import { MailerService } from '@nestjs-modules/mailer';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

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

describe('ContactsController Unit Tests', () => {
  let controller: ContactsController;

  const mockService = {
    findAll: jest.fn().mockResolvedValue(expectedContacts),
    findOne: jest.fn().mockResolvedValue(expectedContact),
    create: jest.fn().mockResolvedValue(expectedContact),
    update: jest.fn().mockResolvedValue(expectedContact),
    delete: jest.fn().mockResolvedValue(id),
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {provide: ContactsService, useValue: mockService}
      ],
      controllers: [ContactsController],
    }).compile();

    controller = module.get(ContactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  describe('findAll', () => {
    it('should return all contact submissions', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(expectedContacts);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should return a contact submission by id', async () => {
      const result = await controller.findOne(id);
      expect(result).toEqual(expectedContact);
      expect(mockService.findOne).toHaveBeenCalled();
    });
    it('should throw an error', async () => {
      try {
        await controller.findOne(faker.string.uuid());
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
  describe('create', () => {
    it('should create a contact submission, send an email en return the contact submission', async () => {
      const result = await controller.create(contactDto);
      expect(result).toEqual(expectedContact);
      expect(mockService.create).toHaveBeenCalled();
    });
  });
  describe('update', () => {
    it('should update and return a contact submission', async () => {
      const result = await controller.update(id, contactDto);
      expect(result).toEqual(expectedContact);
      expect(mockService.update).toHaveBeenCalled();
    });
    it('should throw an error', async () => {
      try {
        await controller.update(faker.string.uuid(), contactDto);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
  describe('delete', () => {
    it('should delete a contact submission and return it\'s id', async () => {
      const result = await controller.delete(id);
      expect(result).toEqual(id);
      expect(mockService.delete).toHaveBeenCalled();
    });
    it('should throw an error', async () => {
      try {
        await controller.delete(faker.string.uuid());
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});

describe('ContactsController Integration Tests', () => {
  let controller: ContactsController;

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
      controllers: [ContactsController]
    }).useMocker((token) => {
      if (token === getRepositoryToken(Contact)) {
        return mockRepository;
      }
      return;
    }).compile();
    
    controller = module.get(ContactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  describe('findAll', () => {
    it('should return all contact submissions', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(expectedContacts);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should return a contact submission by id', async () => {
      const result = await controller.findOne(id);
      expect(result).toEqual(expectedContact);
      expect(mockRepository.findOne).toHaveBeenCalled();
    });
    it('should throw an error', async () => {
      try {
        await controller.findOne(faker.string.uuid());
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('create', () => {
    it('should create a contact submission, send an email en return the contact submission', async () => {
      const result = await controller.create(contactDto);
      expect(result).toEqual(expectedContact);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });
  });
  describe('update', () => {
    it('should update and return a contact submission', async () => {
      const result = await controller.update(id, contactDto);
      expect(result).toEqual(expectedContact);
      expect(mockRepository.preload).toHaveBeenCalled();
    });
    it('should throw an error', async () => {
      try {
        await controller.update(faker.string.uuid(), contactDto);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('delete', () => {
    it('should delete a contact submission and return it\'s id', async () => {
      const result = await controller.delete(id);
      expect(result).toEqual(id);
      expect(mockRepository.remove).toHaveBeenCalled();
    });
    it('should throw an error', async () => {
      try {
        await controller.delete(faker.string.uuid());
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
