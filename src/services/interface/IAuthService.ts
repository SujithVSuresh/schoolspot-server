

import { UserType } from "../../types/types";



export interface IAuthService{
    signup(user: UserType): Promise<string>
}