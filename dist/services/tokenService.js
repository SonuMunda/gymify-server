var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sign, verify } from "../utils/jwtHelpers.js";
import { tokenTypes } from "../config/tokens.js";
import { RefreshTokenModel } from "../models/index.js";
import moment from "moment";
import httpStatus from "http-status";
import APIError from "../utils/APIError.js";
const generateToken = (userId, loginTime, expires, type) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        userId,
        loginTime: new Date(loginTime.valueOf()),
        exp: expires.unix(),
        type,
    };
    let token = yield sign(payload, process.env.JWT_SECRET);
    return token;
});
const saveRefreshToken = (userId, loginTime, token) => __awaiter(void 0, void 0, void 0, function* () {
    yield RefreshTokenModel.findOneAndUpdate({ userRef: userId }, {
        loginTime: new Date(loginTime.valueOf()),
        token: token,
    }, {
        upsert: true,
    });
});
const clearRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    yield RefreshTokenModel.findOneAndDelete({ token: token });
});
const generateAuthTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const loginTime = moment();
    let accessTokenExpiresAt = loginTime
        .clone()
        .add(process.env.ACCESS_TOKEN_EXPIRATION_MINUTES, "minutes");
    const accessToken = yield generateToken(user._id, loginTime, accessTokenExpiresAt, tokenTypes.ACCESS);
    let refreshTokenExpiresAt = loginTime
        .clone()
        .add(process.env.REFRESH_TOKEN_EXPIRATION_DAYS, "days");
    const refreshToken = yield generateToken(user._id, loginTime, refreshTokenExpiresAt, tokenTypes.REFRESH);
    yield saveRefreshToken(user._id, loginTime, refreshToken);
    return {
        accessToken,
        refreshToken,
    };
});
const generateAccessTokenFromRefreshTokenPayload = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, loginTime, platform, }) {
    const now = moment();
    let accessTokenExpiresAt = now.add(process.env.ACCESS_TOKEN_EXPIRATION_MINUTES, "minutes");
    const accessToken = yield generateToken(userId, moment(loginTime), accessTokenExpiresAt, tokenTypes.ACCESS, platform);
    return accessToken;
});
const verifyRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenPayload = yield verify(token, process.env.JWT_SECRET);
    if (!tokenPayload || tokenPayload.type !== tokenTypes.REFRESH)
        throw new APIError(httpStatus.FORBIDDEN, "Invalid Refresh Token - logout");
    let refreshTokenExists = yield RefreshTokenModel.exists({ token: token });
    if (!refreshTokenExists)
        throw new APIError(httpStatus.FORBIDDEN, "Invalid Refresh Token - logout");
    return tokenPayload;
});
export { generateAuthTokens, clearRefreshToken, verifyRefreshToken, generateAccessTokenFromRefreshTokenPayload, };
