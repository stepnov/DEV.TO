import { FastifyInstance } from 'fastify'
import { getCustomRepository, Like } from 'typeorm';
import * as TypeBox from '@sinclair/typebox';
import toString from 'lodash/toString';
import omit from 'lodash/omit';

import { ArticlesRepository } from '../repository/ArticlesRepository';
import { articlesInputSchema, articlesSchema } from '../entity/Articles';

export const tag = 'Articles';

export default async (app: FastifyInstance) => {
    const schema = TypeBox.Type.Object({
        q: TypeBox.Type.Optional(TypeBox.Type.Partial(articlesSchema, { description: 'Filter query', additionalProperties: false })),
        page: TypeBox.Type.Number({ default: 0, minimum: 0, description: 'Page number' }),
        limit: TypeBox.Type.Number({ minimum: 0, maximum: 100, default: 10, description: 'Page size' }),
        field: TypeBox.Type.String({default: ''}),
        sort: TypeBox.Type.String({default: 'DESC'}),
    title: TypeBox.Type.String({default: ''}),
    body: TypeBox.Type.String({default: ''}),

    }, {
        style: 'deepObject',
    });

    app.get<{ Querystring: TypeBox.Static<typeof schema> }>('/articles', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            querystring: schema,
            security: [{
                bearerAuth: [],
            }],
            tags: [tag],
            summary: 'List articles',
        },
    }, async (req) => {
        // @ts-ignore
        const [items, count] = await getCustomRepository(ArticlesRepository).filter(req.query, req.query.page, req.query.limit, req.query.field, req.query.sort.toUpperCase());
        return {
            rows: items,
            count,
            isLastPage: (req.query.page + 1) * req.query.limit >= count,
        };
    });

    const autocompleteSchema = TypeBox.Type.Object({
        query: TypeBox.Type.String({ default: '' }),
        limit: TypeBox.Type.Number({ default: 100, max: 100, min: 1 }),
    });
    const autocompleteItems = TypeBox.Type.Array(TypeBox.Type.Object({
        id: TypeBox.Type.String(),
        label: TypeBox.Type.String(),
    }));

    app.get<{
        Querystring: TypeBox.Static<typeof autocompleteSchema>,
        Reply: TypeBox.Static<typeof autocompleteItems>,
    }>('/articles/autocomplete', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            querystring: autocompleteSchema,
            security: [{
                bearerAuth: [],
            }],
            tags: [tag],
            summary: 'Find articles instance to link as relations',
            response: {
                200: autocompleteItems,
                400: TypeBox.Type.Object({
                    statusCode: TypeBox.Type.Number({ default: 400 }),
                    error: TypeBox.Type.Optional(TypeBox.Type.String()),
                    message: TypeBox.Type.String(),
                }, { description: 'Validation error' }),
            }
        },
    }, async (req) => {
        const repo = getCustomRepository(ArticlesRepository);

        const items = await repo.createQueryBuilder('item')
          .select(['item.id', 'item.title'])

          .where("CAST(item.title as TEXT) LIKE :query", { query: `%${req.query.query}%` })

          .orderBy('item.title', 'ASC')
          .getMany();

        return items.map((item) => ({ id: item.id, label: toString(item.title) }));
    });

    const postPayload = TypeBox.Type.Object({
        data: articlesInputSchema,
    });
    app.post<{
        Body: TypeBox.Static<typeof postPayload>,
        Reply: TypeBox.Static<typeof articlesSchema>
    }>('/articles', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            security: [{
                bearerAuth: [],
            }],
            tags: [tag],
            summary: 'Create new articles',
            body: postPayload,
            response: {
                200: articlesSchema,
                400: TypeBox.Type.Object({
                    statusCode: TypeBox.Type.Number({ default: 400 }),
                    error: TypeBox.Type.Optional(TypeBox.Type.String()),
                    message: TypeBox.Type.String(),
                }, { description: 'Validation error' }),
            },
        },
        // @ts-ignore
    }, async (req) => {
        const repo = getCustomRepository(ArticlesRepository);
        const payload = omit(req.body.data, ['author', 'category', 'tags']);

        const { id } = await repo.save({
            ...payload,

                    author: req.body.data.author ? { id: req.body.data.author } : undefined,

                    category: req.body.data.category ? { id: req.body.data.category } : undefined,

                    tags: req.body.data.tags ? req.body.data.tags.map(id => ({ id })) : undefined,

        });

        return repo.findOne({
            where: {
                id,
            },

            relations: ['author', 'category', 'tags']

        });
    });

    const find = TypeBox.Type.Object({
        id: TypeBox.Type.String({
            format: 'uuid',
        }),
    });

    app.get<{
        Params: TypeBox.Static<typeof find>,
        Reply: TypeBox.Static<typeof articlesSchema>
    }>('/articles/:id', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            params: find,
            tags: [tag],
            summary: 'Get specific articles',
            security: [{
                bearerAuth: [],
            }],
            response: {
                200: articlesSchema,
                404: TypeBox.Type.Object({
                    statusCode: TypeBox.Type.Number({ default: 404 }),
                    error: TypeBox.Type.String({ default: 'Not Found' }),
                    message: TypeBox.Type.String(),
                }, { description: 'Articles not found' }),
            },
        }
    // @ts-ignore
    }, async (req, reply) => {
        const entity = await getCustomRepository(ArticlesRepository).findOne({
            where: {
                id: req.params.id,
            },

            relations: ['author', 'category', 'tags']

        });

        return entity ? entity : reply.notFound('Articles not found');
    });

    const putSchema = TypeBox.Type.Object({
        id: TypeBox.Type.String({ format: 'uuid' }),
        data: TypeBox.Type.Partial(articlesInputSchema),
    });
    app.put<{
        Params: TypeBox.Static<typeof find>,
        Body: TypeBox.Static<typeof putSchema>,
    }>('/articles/:id', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAdmin]),
        schema: {
            summary: 'Edit existing articles',
            params: find,
            body: putSchema,
            tags: [tag],
            security: [{
                bearerAuth: [],
            }],
        }
    }, async (req) => {
        const payload = omit(req.body.data, ['author', 'category', 'tags']);
        const repo = getCustomRepository(ArticlesRepository);

        await repo.save({
            ...payload,

                author: req.body.data.author ? { id: req.body.data.author } : undefined,

                category: req.body.data.category ? { id: req.body.data.category } : undefined,

                tags: req.body.data.tags ? req.body.data.tags.map(id => ({ id })) : undefined,

            id: req.params.id,
        });

        return repo.findOne({
            where: {
                id: req.params.id,
            },

            relations: ['author', 'category', 'tags']

        });
    });

    app.delete<{
        Params: TypeBox.Static<typeof find>,
    }>('/articles/:id', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAdmin]),
        schema: {
            description: 'Delete articles',
            summary: 'Delete articles',
            params: find,
            tags: [tag],
            security: [{
                bearerAuth: [],
            }],
            response: {
                200: {
                    description: 'articles successfully deleted',
                    type: 'null',
                },
                404: TypeBox.Type.Object({
                    statusCode: TypeBox.Type.Number({ default: 404 }),
                    error: TypeBox.Type.String({ default: 'Not Found' }),
                    message: TypeBox.Type.String(),
                }, { description: 'articles not found' }),
            },
        }
    }, async (req, reply) => {
        const entity = await getCustomRepository(ArticlesRepository).softDelete(req.params.id);
        if (!entity.affected) {
            reply.notFound('articles not found');
            return;
        }

        reply.code(200).send();
    });
}
