import { Module } from '@nestjs/common';
import { AllergenService } from './allergen.service';
import { AllergenController } from './allergen.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AllergenController],
  providers: [AllergenService],
})
export class AllergenModule { }
