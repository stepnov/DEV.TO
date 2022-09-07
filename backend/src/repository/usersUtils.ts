import { SelectQueryBuilder } from 'typeorm';

export type EntityQuery<T> = {
    [K in keyof T]?: T[K];
};

/**
 * Applies filter query for any entity query builder
 */

export function applyFilters<T>(qb: SelectQueryBuilder<T>, query?: any) {

    let { firstName } = query;

    if(firstName){
        qb.where("e.firstName like :name", { name:  `%${firstName}%` });
    }
    let { lastName } = query;

    if(lastName){
        qb.where("e.lastName like :name", { name:  `%${lastName}%` });
    }
    let { phoneNumber } = query;

    if(phoneNumber){
        qb.where("e.phoneNumber like :name", { name:  `%${phoneNumber}%` });
    }
    let { email } = query;

    if(email){
        qb.where("e.email like :name", { name:  `%${email}%` });
    }
    return qb;
}
