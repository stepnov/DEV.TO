import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Type, Static } from '@sinclair/typebox';

export const fileSchema = Type.Object({
    id: Type.String(),
    name: Type.String(),
    privateUrl: Type.String(),
    publicUrl: Type.String(),
    sizeInBytes: Type.Number(),
})

@Entity()
export class File implements Static<typeof fileSchema>{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    privateUrl!: string;

    @Column()
    publicUrl!: string;

    @Column()
    sizeInBytes!: number;

    @CreateDateColumn()
    createdAt!: string;

    @UpdateDateColumn()
    updatedAt!: string;

    @DeleteDateColumn()
    deletedAt?: string;
}
