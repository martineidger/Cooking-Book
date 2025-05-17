import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { FavouritesModule } from './favourites/favourites.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [FavouritesModule, DatabaseModule],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule { }
