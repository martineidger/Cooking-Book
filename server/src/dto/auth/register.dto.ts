import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}