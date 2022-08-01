import { Expose } from "class-transformer";
export class UserDto {
    @Expose()
    id: number;

    @Expose()
    token:string;
    @Expose()
    email: string;
}