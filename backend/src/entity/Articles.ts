import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,

    JoinTable,
    ManyToMany,

    ManyToOne,
    JoinColumn,

} from 'typeorm';
import * as TypeBox from '@sinclair/typebox';

import { File, fileSchema } from './File';

import { Users, usersSchema } from './Users';

import { Categories, categoriesSchema } from './Categories';

import { Tags, tagsSchema } from './Tags';

import { Nullable } from '../utils';

/**
 * Schema for articles entity
 */
export const articlesSchema = TypeBox.Type.Object({
    id: TypeBox.Type.String({ format: 'uuid' }),

        title: TypeBox.Type.String({ default: '' }),

        body: TypeBox.Type.String({ default: '' }),

        author: TypeBox.Type.Optional(Nullable(usersSchema)),

        category: TypeBox.Type.Optional(Nullable(categoriesSchema)),

        tags: TypeBox.Type.Array(tagsSchema, { default: [] }),

        featured: TypeBox.Type.Boolean({ default: false }),

        images: TypeBox.Type.Array(fileSchema, { default: [] }),

}, { additionalProperties: false });

/**
 * Input type for editing and creating articles
 */
export const articlesInputSchema = TypeBox.Type.Object({

        title: TypeBox.Type.String({ default: '' }),

        body: TypeBox.Type.String({ default: '' }),

        author: TypeBox.Type.Optional(TypeBox.Type.String()),

        category: TypeBox.Type.Optional(TypeBox.Type.String()),

        tags: TypeBox.Type.Optional(TypeBox.Type.Array(TypeBox.Type.String())),

        featured: TypeBox.Type.Boolean({ default: false }),

        images: TypeBox.Type.Array(fileSchema, { default: [] }),

}, { additionalProperties: false });

export type ArticlesInput = TypeBox.Static<typeof articlesInputSchema>;

@Entity()
export class Articles implements Omit<TypeBox.Static<typeof articlesSchema>, 'author' | 'category'> {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

        @Column({ default: '' })
        title!: string;

        @Column({ default: '' })
        body!: string;

        @ManyToOne(() => Users, { cascade: true })
    @JoinColumn()
        author?: Users;

        @ManyToOne(() => Categories, { cascade: true })
    @JoinColumn()
        category?: Categories;

        @ManyToMany(() => Tags, { cascade: true })
    @JoinTable({ name: 'articles_tags_join' })
        tags!: Tags[];

        @Column({ default: false })
        featured!: boolean;

        @ManyToMany(() => File, { eager: true, cascade: true })
    @JoinTable({ name: 'articles_images_join' })
        images!: File[];

}
