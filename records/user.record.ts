import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {UserEntity} from "../types/user";
import {FieldPacket} from "mysql2";
import {createHash} from "../utils/hash";
import * as jwt from "jsonwebtoken";
import {config} from "../config/config";

type UserRecordResults = [UserRecord[], FieldPacket[]]

export class UserRecord implements UserEntity {
    public id?: string;
    public email: string;
    public pwdHash: string;
    public accountType: string;

    constructor(obj: UserRecord) {
        this.id = obj.id;
        this.email = obj.email;
        this.pwdHash = createHash(obj.pwdHash);
        this.accountType = obj.accountType;
    }

    async register() {
        if (!this.id) {
            this.id = uuid();
        }
        try {
            await pool.execute('INSERT INTO `accounts` VALUES (:id, :email, :pwdHash, :accountType)', {
                id: this.id,
                email: this.email,
                pwdHash: this.pwdHash,
                accountType: this.accountType
            })

            return this.id

        } catch (err) {
            console.log(err)
        }
    }

    static async login(email: string, pwdHash: string): Promise<UserRecord> | null {
        try {
            const [results] = (await pool.execute('SELECT * FROM `accounts` WHERE `email` = :email AND `pwdHash` = :pwdHash', {
                email: email,
                pwdHash: createHash(pwdHash)
            })) as UserRecordResults;
            return results.length === 0 ? null : new UserRecord(results[0]);

        } catch (err) {
            console.log(err)
        }
    }

    static async findOne(id: string): Promise<UserRecord> | null {
        try {
            const [results] = (await pool.execute('SELECT * FROM `accounts` WHERE `id` = :id', {
                id: id,
            })) as UserRecordResults;
            return results.length === 0 ? null : new UserRecord(results[0]);

        } catch (err) {
            console.log(err)
        }
    }


    async addToken(token: string) {

        await pool.execute('UPDATE `accounts` SET `jwtCookie` = :jwtCookie WHERE `id` = :id', {
            id: this.id,
            jwtCookie: token
        })
    }
}
