import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ScoutingModule } from './scouting/scouting.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PitScoutingModule } from './pit-scouting/pit-scouting.module';
import { TBAModule } from './tba/tba.module';
import { TBAEvent } from './tba/tba-event.entity';
import { TBAMatch } from './tba/tba-match.entity';
import { Team } from './team/team.entity';
import { AppController } from './app.controller';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true, // 临时启用以创建表，创建后改回 false
        ssl: process.env.NODE_ENV === 'production' ? {
          rejectUnauthorized: false, // 允许自签名证书
        } : false,
        extra: {
          // 优化 serverless 环境
          max: 1, // 限制连接数
          connectionTimeoutMillis: 10000,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([TBAEvent, TBAMatch, Team]),
    ScoutingModule,
    UserModule,
    AuthModule,
    PitScoutingModule,
    TBAModule,
    EventModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
