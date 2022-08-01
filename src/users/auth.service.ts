import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService) { }

    async signup(email: string, password: string) {
        //See if email is in use
        const users = await this.usersService.find(email);
        if (users) {
            throw new BadRequestException("Email in use");

        }
        //Hash the users password 
        //Generate a salt
        const salt = randomBytes(8).toString('hex');

        //Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        //Create a new user and save it
        const user = await this.usersService.create(email, result);
        //return the user
        return user;
    }

    async signin(email: string, password: string) {
        const user = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }
        const token = jwt.sign({ email }, "jh4gr34u5y82rgkfwi4ury98tyfg2iury39t8y", { expiresIn: "1d" });



        const res = { token, ...user };
        return res;

    }
} 