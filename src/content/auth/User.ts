export type User = {
    id?: number;
    username: string;
    email: string;
    password: string;
};

export const defaultUser: User = {
    id: undefined,
    username: '',
    email: '',
    password: ''
};