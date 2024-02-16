import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  providers: [ContactsService],
  exports: [ContactsService, TypeOrmModule],
})
export class ApiContactsDataAccessModule {}
