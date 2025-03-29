import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt } from 'class-validator';
import { CreateCookingStepDto } from './create-cooking-step.dto';

export class CreateCookingPhaseDto {
    @IsString()
    @IsNotEmpty()
    title: string; // Название этапа

    @IsInt()
    @IsOptional()
    durationMin: number; // Время, затрачиваемое на этап (в минутах)

    @IsArray()
    @IsOptional()
    steps?: CreateCookingStepDto[]; // Шаги приготовления
}