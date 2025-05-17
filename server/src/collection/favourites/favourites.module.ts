import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    exports: [FavouritesService],
    providers: [FavouritesService],
})
export class FavouritesModule { }
