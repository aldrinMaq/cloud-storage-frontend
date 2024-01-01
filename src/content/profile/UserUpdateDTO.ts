export interface UserUpdateDTO {
    username?: string;
    email?: string;
    password?: string;
}

export const defaultUserUpdateDTO: UserUpdateDTO = {
    username: '',
    email: '',
    password: '',
}