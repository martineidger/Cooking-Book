import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

//export class UpdateUserDto extends PartialType(CreateUserDto) {}
import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @IsOptional()
    username?: string

    @IsString()
    @IsOptional()
    email?: string

    @IsString()
    @IsOptional()
    password?: string

    @IsArray()
    @IsOptional()
    recipes?: { recipyId: string }[]

    @IsArray()
    @IsOptional()
    Subscription?: { subscriptionId: string }[]
}
