import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,

    ManyToOne,
    JoinColumn,

} from 'typeorm';
import * as TypeBox from '@sinclair/typebox';

import { Users, usersSchema } from './Users';

import { Articles, articlesSchema } from './Articles';

import { Nullable } from '../utils';

/**
 * Schema for comments entity
 */
export const commentsSchema = TypeBox.Type.Object({
    id: TypeBox.Type.String({ format: 'uuid' }),

        text: TypeBox.Type.String({ default: '' }),

        author: TypeBox.Type.Optional(Nullable(usersSchema)),

        article: TypeBox.Type.Optional(Nullable(articlesSchema)),

        moderated: TypeBox.Type.Boolean({ default: false }),

}, { additionalProperties: false });

/**
 * Input type for editing and creating comments
 */
export const commentsInputSchema = TypeBox.Type.Object({

        text: TypeBox.Type.String({ default: '' }),

        author: TypeBox.Type.Optional(TypeBox.Type.String()),

        article: TypeBox.Type.Optional(TypeBox.Type.String()),

        moderated: TypeBox.Type.Boolean({ default: false }),

}, { additionalProperties: false });

export type CommentsInput = TypeBox.Static<typeof commentsInputSchema>;

@Entity()
export class Comments implements Omit<TypeBox.Static<typeof commentsSchema>, 'author' | 'article'> {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

        @Column({ default: '' })
        text!: string;

        @ManyToOne(() => Users, { cascade: true })
    @JoinColumn()
        author?: Users;

        @ManyToOne(() => Articles, { cascade: true })
    @JoinColumn()
        article?: Articles;

        @Column({ default: false })
        moderated!: boolean;

}
