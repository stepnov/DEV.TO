import { EntityRepository, Repository } from 'typeorm';

import { Tags } from '../entity/Tags';
import { applyFilters, EntityQuery } from './tagsUtils';

@EntityRepository(Tags)
export class TagsRepository extends Repository<Tags> {

    filter(query: any | undefined, page: number, size: number, field: string | undefined, sort: "ASC" | "DESC" | undefined = "ASC" ): Promise<[Tags[], number]> {
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
