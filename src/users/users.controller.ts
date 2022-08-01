import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, Session, UseGuards, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import * as jwt from 'jsonwebtoken';
import { User } from './user.entity';
import { AuthGaurd } from '../gaurds/auth.gaurd';
import { ApiBasicAuth, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
@ApiBearerAuth()
@ApiBasicAuth()
@ApiTags('users')
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }
    // @Get('/whoami')
    // whoAmI(@Session() session:any){
    //     return this.usersService.findOne(session.userId)
    // } 

    @Get('/whoami')
    @UseGuards(AuthGaurd)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any, @Res({ passthrough: true }) response: Response) {
        const user = await this.authService.signup(body.email, body.password);


        response.cookie('jwt', user.token)
        session.userId = user.id;
        response.send({
            success: true,
            id: user.id,
            email: user.email,
            token: user.token,
        })
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any, @Res({ passthrough: true }) response: Response) {
        const user = await this.authService.signin(body.email, body.password);

        response.cookie('jwt', user.token)
        session.userId = user.id;
        response.send({
            success: true,
            id: user.id,
            email: user.email,
            token: user.token,
        })


        // return user;
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    //@Serialize(UserDto) //serialize one decorator
    @Get('/:id')
    async findUser(@Param('id') id: string) {

        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removerUser(@Param('id') id: string) {


        return this.usersService.remove(parseInt(id))
    }

    @Patch('/:id')
    UpdateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);

    }

}
