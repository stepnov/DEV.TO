import {MigrationInterface, QueryRunner} from "typeorm";
import { Users, Role } from '../entity/Users';
import { hashPassword } from '../subscribers/UsersSubscriber';

export class UsersSeed1646137371088 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = new Users();
        user.firstName = 'Admin';
        user.email = 'admin@flatlogic.com';
        user.provider = 'local';
        user.password = hashPassword('password');
        user.role = Role.Admin;
        user.emailVerified = true;
        await queryRunner.connection.getRepository(Users).save(user);

        const john = new Users();
        john.firstName = 'John';
        john.email = 'john@doe.com';
        john.provider = 'local';
        john.password = hashPassword('password');
        john.role = Role.User;
        john.emailVerified = true;
        await queryRunner.connection.getRepository(Users).save(john);

        const client = new Users();
        client.firstName = 'Client';
        client.email = 'client@hello.com';
        client.provider = 'local';
        client.password = hashPassword('password');
        client.role = Role.User;
        client.emailVerified = true;
        await queryRunner.connection.getRepository(Users).save(client);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
