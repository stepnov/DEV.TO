import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import bcrypt from 'bcrypt';

import { Users } from '../entity/Users';

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 12);
}

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<Users> {
    listenTo() {
        return Users;
    }

    beforeInsert(event: InsertEvent<Users>) {
        if (event.entity.password) {
            event.entity.password = hashPassword(event.entity.password);
        }
    }

    beforeUpdate(event: UpdateEvent<Users>) {
        if (event.entity?.password) {
            event.entity.password = hashPassword(event.entity.password);
        }
    }
}
