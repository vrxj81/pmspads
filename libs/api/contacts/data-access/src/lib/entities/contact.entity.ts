import { IContact } from "@pmspads/domain-interfaces";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Contact implements IContact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({nullable: true})
  phone?: string | undefined;

  @Column({nullable: true})
  url?: string | undefined;

  @Column()
  subject!: string;

  @Column('text')
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}