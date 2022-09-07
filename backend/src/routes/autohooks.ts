import { FastifyInstance, FastifyRequest } from 'fastify';
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repository/UsersRepository';
import { Role, Users } from '../entity/Users';

export default async function (app: FastifyInstance) {
    app.decorate('verifyAuthorized', async (req: FastifyRequest) => {
        const { user: payload } = await req.jwtVerify<{ user: Users }>();
        if (!await getCustomRepository(UsersRepository).exists(payload.email)) {
            throw app.httpErrors.unauthorized();
        }
    });

    app.decorate('verifyAdmin', async (req: FastifyRequest) => {
        const { user: payload } = await req.jwtVerify<{ user: Users }>();
        const status = await getCustomRepository(UsersRepository).hasRole(payload.id, Role.Admin);
        if (!status) {
            throw app.httpErrors.forbidden();
        }
    });
}
