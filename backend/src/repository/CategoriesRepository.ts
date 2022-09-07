import { EntityRepository, Repository } from 'typeorm';

import { Categories } from '../entity/Categories';
import { applyFilters, EntityQuery } from './categoriesUtils';

@EntityRepository(Categories)
export class CategoriesRepository extends Repository<Categories> {

    filter(query: any | undefined, page: number, size: number, field: string | undefined, sort: "ASC" | "DESC" | undefined = "ASC" ): Promise<[Categories[], number]> {
        const qb = this.createQueryBuilder('e');
        applyFilters(qb, query);
        if(field) {
            return qb
                .skip(page * size)
                .take(size)
                .orderBy(`e.${field}`, sort)

                .getManyAndCount();
        } else {
            return qb
                .skip(page * size)
                .take(size)

                .getManyAndCount();
        }
    }
}
