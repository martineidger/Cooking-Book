import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBaseElement {
    @IsString()
    @IsNotEmpty()
    name: string;

}