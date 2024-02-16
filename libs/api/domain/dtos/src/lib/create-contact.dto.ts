import { IContact } from "@pmspads/domain-interfaces";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl } from "class-validator";

export class CreateContactDto implements Pick<IContact, 'name' | 'email' | 'url' | 'phone' | 'subject' | 'message'> {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsUrl()
  @IsOptional()
  url?: string | undefined;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string | undefined;

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

}