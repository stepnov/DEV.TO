import { EntityRepository, Repository } from 'typeorm';

import { Articles } from '../entity/Articles';
import { applyFilters, EntityQuery } from './articlesUtils';

@EntityRepository(Articles)
export class ArticlesRepository extends Repository<Articles> {

    filter(query: any | undefined, page: number, size: number, field: string | undefined, sort: "ASC" | "DESC" | undefined = "ASC" ): Promise<[Articles[], number]> {
        const qb = this.createQueryBuilder('e');
        applyFilters(qb, query);
        if(field) {
            return qb
                .skip(page * size)
                .take(size)
                .orderBy(`e.${field}`, sort)

                .leftJoinAndSelect('e.author', 'author')

                .leftJoinAndSelect('e.category', 'category')

                .leftJoinAndSelect('e.tags', 'tags')

                .leftJoinAndSelect('e.images', 'images')

                .getManyAndCount();
        } else {
            return qb
                .skip(page * size)
                .take(size)

                .leftJoinAndSelect('e.author', 'author')

                .leftJoinAndSelect('e.category', 'category')

                .leftJoinAndSelect('e.tags', 'tags')

                .leftJoinAndSelect('e.images', 'images')

                .getManyAndCount();
        }
    }
}
