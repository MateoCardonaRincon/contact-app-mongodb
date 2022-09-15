import {
    IsBoolean,
    IsNotEmpty,
    IsObject,
    IsOptional,
    Length
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class ContactDto {

    @IsNotEmpty({
        message: 'Related user must be specified.'
    })
    @IsObject({
        message: "'user' property must be an object of the type {id : 'uuid'}"
    })
    user: User;

    @IsNotEmpty({
        message: "'name' property is required."
    })
    @Length(3, 80, {
        message: "'name' property must be between $constraint1 and $constraint2 characters."
    })
    name: string;

    @IsOptional()
    @Length(3, 80, {
        message: "'lastname' property must be between $constraint1 and $constraint2 characters."
    })
    lastname?: string;

    @IsBoolean({
        message: "'status' property must be a boolean."
    })
    status: boolean;
}
