import path from 'path';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { config } from 'dotenv';
import set from 'lodash/set';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

config();
if (process.env.NODE_ENV !== 'production') {
    config({
        path: path.resolve(process.cwd(), '.env.local'),
        override: true,
    });
}

import fastify from 'fastify';
import fastifySensible from '@fastify/sensible';
import autoload from '@fastify/autoload';
import swagger from '@fastify/swagger';
import fastifyJwt from '@fastify/jwt';
import fastifyAuth from '@fastify/auth';
import qs from 'qs';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const pino = require('pino')

// Logger
const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
            }
        },
    },
    ajv: {
        customOptions: {
            strict: 'log',
            keywords: ['kind', 'modifier', 'min', 'max', 'style']
        }
    },
    querystringParser: (str: string) => qs.parse(str),
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(fastifySensible);
server.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
server.register(fastifyAuth);
server.register(fastifyCors, { origin: true });
server.register(fastifyMultipart);
server.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'public'),
});
server.setNotFoundHandler((req: any, reply: { sendFile: (arg0: string) => void; }) => {
    reply.sendFile('index.html');
});

server.setErrorHandler(function (error: any, request: any, reply: any) {
    if (error.validation) {
        const errors = {};
        for (const validation of error.validation) {
            set(errors, validation.dataPath.slice(1), validation.message);
        }
        reply.status(400).send({
            ...server.httpErrors.badRequest(error.message),
            errors,
        });
        return;
    }

    // Error handler for fastifySensible
    // @ts-ignore
    if (reply.raw.statusCode === 500 && error.explicitInternalServerError !== true) {
        request.log.error(error)
        reply.send(new Error('Something went wrong'))
    } else {
        reply.send(error)
    }
});

// Swagger
(() => {
    const { name, version, description } = require('../package.json');
    server.register(swagger, {
        routePrefix: process.env.SWAGGER_PATH,
        openapi: {
            info: {
                title: `${name} API`,
                version: version,
                description: description,
            },
            servers: [{
                url: `http://${process.env.HOST}:${process.env.PORT}`,
            }],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    }
                }
            }
        },
        exposeRoute: true,
    });
    server.log.info(`Swagger started at http://${process.env.HOST}:${process.env.PORT}${process.env.SWAGGER_PATH}`);
})();

// Routes
server.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    routeParams: true,
    options: {
        prefix: '/api',
    },
    autoHooks: true,
    cascadeHooks: true,
});

// Start
(async () => {
    try {
        await createConnection();
        await server.listen(8080, '0.0.0.0');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();

process.on('unhandledRejection', e => {
    server.log.error(e);
});
