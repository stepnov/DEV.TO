import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,

    JoinTable,
    ManyToMany,

} from 'typeorm';
import * as TypeBox from '@sinclair/typebox';

import { File, fileSchema } from './File';

import { Nullable } from '../utils';

export enum Role {

        Admin = 'admin',

        User = 'user',

}

/**
 * Schema for users entity
 */
export const usersSchema = TypeBox.Type.Object({
    id: TypeBox.Type.String({ format: 'uuid' }),

        firstName: TypeBox.Type.String({ default: '' }),

        lastName: TypeBox.Type.String({ default: '' }),

        phoneNumber: TypeBox.Type.String({ default: '' }),

        email: TypeBox.Type.String(),

        role: TypeBox.Type.Enum(Role),

        disabled: TypeBox.Type.Boolean({ default: false }),

        avatar: TypeBox.Type.Array(fileSchema, { default: [] }),

}, { additionalProperties: false });

/**
 * Input type for editing and creating users
 */
export const usersInputSchema = TypeBox.Type.Object({

        firstName: TypeBox.Type.String({ default: '' }),

        lastName: TypeBox.Type.String({ default: '' }),

        phoneNumber: TypeBox.Type.String({ default: '' }),

        email: TypeBox.Type.String(),

        role: TypeBox.Type.Enum(Role),

        disabled: TypeBox.Type.Boolean({ default: false }),

        avatar: TypeBox.Type.Array(fileSchema, { default: [] }),

        password: TypeBox.Type.String(),

}, { additionalProperties: false });

export type UsersInput = TypeBox.Static<typeof usersInputSchema>;

@Entity()
export class Users implements Omit<TypeBox.Static<typeof usersSchema>, 'emailVerificationTokenExpiresAt' | 'passwordResetTokenExpiresAt'> {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

        @Column({ default: '' })
        firstName!: string;

        @Column({ default: '' })
        lastName!: string;

        @Column({ default: '' })
        phoneNumber!: string;

        @Column({ default: '' })
        email!: string;

        @Column({ type: 'enum', enum: Role })
        role!: Role;

        @Column({ default: false })
        disabled!: boolean;

        @ManyToMany(() => File, { eager: true, cascade: true })
    @JoinTable({ name: 'users_avatar_join' })
        avatar!: File[];

        @Column({ default: '' })
        password!: string;

        @Column({ default: false })
        emailVerified!: boolean;

        @Column({ default: '' })
        emailVerificationToken!: string;

        @Column({ type: 'timestamptz', nullable: true })
        emailVerificationTokenExpiresAt?: Date;

        @Column({ default: '' })
        passwordResetToken!: string;

        @Column({ type: 'timestamptz', nullable: true })
        passwordResetTokenExpiresAt?: Date;

        @Column({ default: '' })
        provider!: string;

}
