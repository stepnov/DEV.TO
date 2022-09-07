import { EntityRepository, Repository } from 'typeorm';

import { Comments } from '../entity/Comments';
import { applyFilters, EntityQuery } from './commentsUtils';

@EntityRepository(Comments)
export class CommentsRepository extends Repository<Comments> {

    filter(query: any | undefined, page: number, size: number, field: string | undefined, sort: "ASC" | "DESC" | undefined = "ASC" ): Promise<[Comments[], number]> {
        const qb = this.createQueryBuilder('e');
        applyFilters(qb, query);
        if(field) {
            return qb
                .skip(page * size)
                .take(size)
                .orderBy(`e.${field}`, sort)

                .leftJoinAndSelect('e.author', 'author')

                .leftJoinAndSelect('e.article', 'article')

                .getManyAndCount();
        } else {
            return qb
                .skip(page * size)
                .take(size)

                .leftJoinAndSelect('e.author', 'author')

                .leftJoinAndSelect('e.article', 'article')

                .getManyAndCount();
        }
    }
}
