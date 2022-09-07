import { SelectQueryBuilder } from 'typeorm';

export type EntityQuery<T> = {
    [K in keyof T]?: T[K];
};

/**
 * Applies filter query for any entity query builder
 */

export function applyFilters<T>(qb: SelectQueryBuilder<T>, query?: any) {

    let { title } = query;

    if(title){
        qb.where("e.title like :name", { name:  `%${title}%` });
    }
    let { body } = query;

    if(body){
        qb.where("e.body like :name", { name:  `%${body}%` });
    }
    return qb;
}
