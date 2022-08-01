import { Module } from '@nestjs/common';
import { User } from './users/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
//const cookieSession=require('cookie-session');



@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User, Report],
    synchronize: true,
    autoLoadEntities: true,
  }),
    UsersModule,
    ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
