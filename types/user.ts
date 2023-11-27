export interface UserEntity {
    id?: string;
    email: string;
    pwdHash: string;
    accountType: string;
    jwtCookie?: string
}

export type CreateUserReq = Omit<UserEntity, 'id'>;

export interface UserLogin {
    email: string;
    pwdHash: string;
}
