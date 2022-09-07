import { EntityRepository, Repository } from 'typeorm';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dayjs from 'dayjs';

import { Users , Role } from '../entity/Users';
import { applyFilters, EntityQuery } from './usersUtils';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {

    /**
     * Register new user with email and password
     *
     * @param payload
     */
    async register(payload: { email: string, password: string }): Promise<Users> {
        return this.save({
            role: Role.User,
            email: payload.email,
            password: payload.password,
            provider: 'local',
            emailVerified: false,
            emailVerificationToken: crypto.randomBytes(20).toString('hex'),
            emailVerificationTokenExpiresAt: dayjs().add(24, 'hours').toDate(),
        });
    }

    async verifyEmail(token: string): Promise<true | string> {
        const user = await this.findOne({ where: { emailVerificationToken: token }, select: ['id', 'emailVerificationTokenExpiresAt'] });
        if (!user) {
            return 'Token is not recognized';
        }

        if (dayjs(user.emailVerificationTokenExpiresAt).isBefore(dayjs().add(24, 'hours'))) {
            await this.update(user.id, {
                emailVerified: true,
                emailVerificationToken: '',
                emailVerificationTokenExpiresAt: undefined
            });
            return true;
        }

        return 'Email verification token is expired';
    }

    async passwordUpdate(id: string, password: string, newPassword: string): Promise<boolean> {
        const user = await this.findOne({ where: { id: id },  select: ['id', 'password'] });

        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                await this.update(user.id, {
                    password: newPassword,
                });

                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    /**
     * Check if user exists
     * @param email
     */
    async exists(email: string): Promise<boolean> {
        return await this.count({ where: { email } }) > 0;
    }

    async verifyEmailAndPassword(email: string, password: string): Promise<false | string> {
        const user = await this.findOne({ where: { email }, select: ['password', 'id'] });
        if (user) {
            return bcrypt.compareSync(password, user.password) ? user.id : false;
        }
        return false;
    }

    async hasRole(id: string, role: Role): Promise<boolean> {
        const user = await this.findOne({
            where: { id },
        });

        return user?.role === role;
    }

    filter(query: any | undefined, page: number, size: number, field: string | undefined, sort: "ASC" | "DESC" | undefined = "ASC" ): Promise<[Users[], number]> {
        const qb = this.createQueryBuilder('e');
        applyFilters(qb, query);
        if(field) {
            return qb
                .skip(page * size)
                .take(size)
                .orderBy(`e.${field}`, sort)

                .leftJoinAndSelect('e.avatar', 'avatar')

                .getManyAndCount();
        } else {
            return qb
                .skip(page * size)
                .take(size)

                .leftJoinAndSelect('e.avatar', 'avatar')

                .getManyAndCount();
        }
    }
}
