import { ConsoleLogger, Logger, Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [PhotosService],
    exports: [PhotosService],
})
export class PhotosModule { }