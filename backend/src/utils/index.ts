import { TNull, TSchema, TUnion } from '@sinclair/typebox';

export function Nullable<T extends TSchema>(type: T): TUnion<[T, TNull]> {
    return {...type, nullable: true} as any
}