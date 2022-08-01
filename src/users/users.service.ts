import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    async create(email: string, password: string) {
        const user = this.repo.create({ email, password });


        const token = jwt.sign({ email }, 'jh4gr34u5y82rgkfwi4ury98tyfg2iury39t8y', {
            expiresIn: '30d',
        });
        const obj = await this.repo.save(user);
        const res = { token, ...obj };
        return res;


    }
    findOne(id: number) {
        if (!id) {
            return null;
        }

        return this.repo.findOneBy({ id });


    }

    find(email: string): Promise<any> {
        return this.repo.findOneBy({ email });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return this.repo.remove(user);
    }


}
