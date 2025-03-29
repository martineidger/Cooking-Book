import { Module } from '@nestjs/common';
import { CookingPhaseService } from './cooking-phase.service';
import { CookingPhaseController } from './cooking-phase.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [CookingPhaseController],
  providers: [CookingPhaseService, DatabaseService],
})
export class CookingPhaseModule { }
