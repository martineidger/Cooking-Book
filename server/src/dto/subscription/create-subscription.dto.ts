import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateSubscriptionDto {
    @IsNotEmpty()
    categoryId: string

    @IsNotEmpty()
    userId: string
}