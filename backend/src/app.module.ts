import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallsModule } from './calls/calls.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TalkiesModule } from './talkies/talkies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CallsModule,
    PrismaModule,
    TalkiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
