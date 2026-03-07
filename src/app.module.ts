import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScoutingModule } from './scouting/scouting.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PitScoutingModule } from './pit-scouting/pit-scouting.module';

@Module({
  imports: [
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
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ScoutingModule,
    UserModule,
    AuthModule,
    PitScoutingModule,
  ],
})
export class AppModule {}
