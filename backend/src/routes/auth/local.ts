import { FastifyInstance } from 'fastify';
import { getCustomRepository } from 'typeorm';
import { Static, Type } from '@sinclair/typebox';

import { UsersRepository } from '../../repository/UsersRepository';
import { Users, usersSchema } from '../../entity/Users';
import { sendMail } from '../../email';

const tag = 'Auth';

export default async (app: FastifyInstance) => {
    const signInSchema = Type.Object({
        email: Type.String({ format: 'email' }),
        password: Type.String(),
    });
    app.post<{ Body: Static<typeof signInSchema>}>('/signin/local', {
        schema: {
            tags: [tag],
            summary: 'Log into system',
            description: 'Generates JWT authorization token',
            body: signInSchema,
            response: {
                // TODO: replace raw string with json { accessToken, refreshToken }
                200: Type.String(),
            },
        },
    },async (req, reply) => {
        const id = await getCustomRepository(UsersRepository).verifyEmailAndPassword(req.body.email, req.body.password);
        if (!id) {
            reply.unauthorized('Bad credentials');
            return;
        }

        const user = await getCustomRepository(UsersRepository).findOneOrFail(id);
        if (user.disabled) {
            reply.unauthorized('User disabled');
            return;
        }
        if (!user.emailVerified) {
            reply.unauthorized('Email is not verified');
            return;
        }

        return app.jwt.sign({ user }, { expiresIn: '6h' });
    });

    const verifyEmail = Type.Object({
        token: Type.String(),
    });
    app.put<{ Body: Static<typeof verifyEmail> }>('/verify-email', {
        schema: {
            tags: [tag],
            summary: 'Verify email',
            body: verifyEmail,
            response: {
                200: {
                    description: 'Email successfully verified',
                    type: 'null',
                },
                400: Type.Object({
                    statusCode: Type.Number({ default: 400 }),
                    error: Type.String(),
                    message: Type.String(),
                }, { description: 'Email verification error' }),
            }
        },
    }, async (req, reply) => {
        const message = await getCustomRepository(UsersRepository).verifyEmail(req.body.token);
        if (message === true) {
            reply.code(200).send();
        } else {
            reply.badRequest(message);
        }
    });

    app.get('/me', {
        // @ts-ignore
        preHandler: app.auth([app.verifyAuthorized]),
        schema: {
            summary: 'Get current authorized user info',
            security: [{
                bearerAuth: [],
            }],
            tags: [tag],
            response: {
                200: usersSchema,
            },
        }
    }, async (req, reply) => {
        const payload = await req.jwtVerify<{ user: Users }>();
        const user = await getCustomRepository(UsersRepository).findOne(payload.user.id);
        if (user) {
            return user;
        } else {
            reply.unauthorized();
        }
    });

    const signupPayload = Type.Object({
        email: Type.String({ format: 'email' }),
        password: Type.String({
            minLength: 6,
        }),
    })
    app.post<{ Body: Static<typeof signupPayload>}>('/signup', {
        schema: {
            tags: [tag],
            summary: 'Register new user',
            description: 'Register new user and send email verification',
            body: signupPayload,
            response: {
                200: {
                    description: 'Email successfully verified',
                    type: 'null',
                },
                400: Type.Object({
                    statusCode: Type.Number({ default: 400 }),
                    error: Type.String(),
                    message: Type.String(),
                }, { description: 'Validation error' }),
            }
        },
    }, async (req, reply) => {
        const repo = getCustomRepository(UsersRepository);
        if (await repo.exists(req.body.email)) {
            return reply.badRequest('User already registered');
        }
        const user = await repo.register(req.body);
        sendMail('verifyEmail', {
            to: req.body.email,
            subject: 'Verify your email'
        }, {
            company: 'Test',
            link: `${req.protocol}://${req.hostname}/#/verify-email?token=${user.emailVerificationToken}`,
        })
            .catch((e: Error) => app.log.error('Error sending email', e));

        reply.code(200).send();
    });
    const passwordUpdate = Type.Object({
        currentPassword: Type.String(),
        newPassword: Type.String(),
    });
    app.put<{ Body: Static<typeof passwordUpdate > }>('/password-update', {},
    async (req, reply) => {
        const repo = getCustomRepository(UsersRepository);
        const payload = await req.jwtVerify<{ user: Users }>();
        const user = await getCustomRepository(UsersRepository).findOne(payload.user.id);
        if (user) {
            const result = await repo.passwordUpdate(user.id, req.body.currentPassword, req.body.newPassword);
            if (!result) {
                reply.unauthorized('Bad credentials');
            } else {
                reply.status(200).send();
            }
        } else {
            reply.unauthorized('Bad credentials');
            return;
        }


})
}
