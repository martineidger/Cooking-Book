import { PartialType } from '@nestjs/mapped-types';
import { CreateCookingPhaseDto } from './create-cooking-phase.dto';

export class UpdateCookingPhaseDto extends PartialType(CreateCookingPhaseDto) { }
