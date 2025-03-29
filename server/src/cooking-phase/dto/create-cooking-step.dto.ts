import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateCookingStepDto {
  @IsString()
  @IsOptional()
  description: string; // Описание шага

  @IsString()
  @IsOptional()
  image?: string; // URL изображения

  @IsInt()
  @IsNotEmpty()
  order: number; // Порядок выполнения шага

  @IsInt()
  @IsOptional()
  durationMin: number; // Время, затрачиваемое на шаг (в минутах)
}