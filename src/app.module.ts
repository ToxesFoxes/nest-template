import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/envs/loader';
import { ExampleModule } from './modules/example/example.module';
import { AuthModule } from './modules/auth/auth.module';

const envFilePath = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath, isGlobal: true,
    }),
    ExampleModule,
    AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
