import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [HttpModule.register({
        timeout: 5000,
        maxRedirects: 2,
    }), ConfigModule],
    providers: [],
    exports: [HttpModule, ConfigModule],
})
export class UtilsModule { }
