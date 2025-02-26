import jwt, { SignOptions } from 'jsonwebtoken'
import { ObjectId } from 'mongoose'
import { PayloadType } from '../types/types'


class AuthToken {
    private _accessTokenSecret: string
    private _refreshTokenSecret: string
    private _accessTokenExpiry: string
    private _refreshTokenExpiry: string 

    constructor(){
        this._accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "default_access_token"
        this._refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "default_refresh_token"
        this._accessTokenExpiry = "15m"
        this._refreshTokenExpiry = "7d"
    }

    generateAccessToken(payload: PayloadType): string{
        const accessToken = jwt.sign(
            payload,
            this._accessTokenSecret,
            { expiresIn: this._accessTokenExpiry } as SignOptions
        )
        return accessToken
    }

    generateRefreshToken(payload: PayloadType): string{
        const refreshToken = jwt.sign(
            payload,
            this._refreshTokenSecret,
            {expiresIn: this._refreshTokenExpiry} as SignOptions
        )
        return refreshToken
    }

    verifyToken(token: string): PayloadType{
        const decoded = jwt.verify(
            token,
            this._accessTokenSecret
        ) as PayloadType

        return decoded
    }
}

const authToken = new AuthToken()

export default authToken