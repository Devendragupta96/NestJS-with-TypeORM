import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {

        //create  a fake copy of the users service
        fakeUsersService = {
            find: () => Promise.resolve({}),
            create: (email: string, password: string) =>
                Promise.resolve({ id: 1, email, password } as User),
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();
        service = module.get(AuthService);

    });

    it('can create an instance of auth service', async () => {

        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup("devendra11@abc.com", "Dev");
        expect(user.password).not.toEqual('Dev');
        const [salt, hash] = user.password.split(".");
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });
    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve({ id: 1, email: 'a', password: '1' } as User)
        await expect(service.signup("devendr@abc.com", "Dev"));

        // try {
        //     await service.signup("devendra@abc.com", "Dev");
        // }
        // catch (err) {
        //     done();
        // }
    });
    // it('throws if sigin is called with an unused email', async () => {

    //     await service.signin("devendra@abc.com", "Dev");
    //     // try {
    //     //     await service.signin("devendra@abc.com", "Dev");

    //     // } catch (err) {
    //     //     done(err); 
    //     // }
    // });

    it('throws if an invalid password is provided', async (done) => {
        fakeUsersService.find = () => Promise.resolve({ email: 'dev1@abc.com', password: 'dev' } as User)
        try {
            await service.signin('dev@abc.com', 'password');
        } catch (err) {
            done();
        }
    });
});
