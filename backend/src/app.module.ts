import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallsModule } from './calls/calls.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';
import { TalkiesModule } from './talkies/talkies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CallsModule,
    TalkiesModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
