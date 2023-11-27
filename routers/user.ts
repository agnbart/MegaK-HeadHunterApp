import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {config} from "../config/config";
import * as jwt from 'jsonwebtoken';

export const userRouter = Router()

userRouter
    .post('/register', async (req, res) => {
        const newUser = new UserRecord(req.body)
        if (!newUser.email || !newUser.pwdHash || !newUser.accountType) {
            return res.status(401).json({
                message: "Nieprawidłowe zapytanie!"
            })
        }

        const newUserId = await newUser.register()
        res.status(201).json({
            message: `Użytkownik o ID ${newUserId} dodany pomyślnie.`
        })

    })
    .get('/login', async (req, res) => {
        const loginData = req.body
        if (!loginData.email || !loginData.pwdHash) {
            return res.status(401).json({
                message: "Nieprawidłowe zapytanie!"
            })
        }
        const user = await UserRecord.login(loginData.email, loginData.pwdHash)
        if (!user) {
            return res.status(401).json({
                message: 'Logowanie nieudane, dane niepoprawne.'
            })
        }

        const maxAge = 30 * 24 * 60 * 60;
        const token = jwt.sign(
            {id: user.id, role: user.accountType},
            config.jwtSecret,
            {
                expiresIn: maxAge,
            }
        );


        await user.addToken(token)

        if (user) {
            res.status(200)
                .cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge
                })
                .json({
                    message: `Pomyślnie zalogowano użytkownika o ID ${user.id}`
                })
        }
    })
