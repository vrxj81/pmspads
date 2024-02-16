import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ApiContactsDataAccessModule } from '@pmspads/api-contacts-data-access';

@Module({
  imports: [ApiContactsDataAccessModule],
  controllers: [ContactsController],
  providers: [],
  exports: [],
})
export class ApiContactsFeatureModule {}
