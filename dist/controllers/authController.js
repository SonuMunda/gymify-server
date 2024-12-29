var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcryptjs from "bcryptjs";
import { fetchUserFromEmailAndPassword, updatePassword, verifyCurrentPassword, verifyUserFromRefreshTokenPayload, createNewUser, fetchUserFromEmail, } from "../services/authService.js";
import { generateAuthTokens, clearRefreshToken, verifyRefreshToken, generateAccessTokenFromRefreshTokenPayload, } from "../services/tokenService.js";
import { OAuth2Client } from "google-auth-library";
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log("email", email);
    try {
        const hashedPassword = yield bcryptjs.hash(password, 10);
        const newUser = yield createNewUser({
            email: email,
            password: hashedPassword,
            source: "email",
        });
        const tokens = yield generateAuthTokens(newUser);
        res.json({ user: newUser, tokens });
    }
    catch (error) {
        next(error);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield fetchUserFromEmailAndPassword(req.body);
        const tokens = yield generateAuthTokens(user);
        res.json({ user, tokens });
    }
    catch (error) {
        next(error);
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield clearRefreshToken(req.body.refreshToken);
        res.json({});
    }
    catch (error) {
        next(error);
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        let refreshTokenPayload = yield verifyRefreshToken(refreshToken);
        console.log();
        yield verifyUserFromRefreshTokenPayload(refreshTokenPayload);
        let newAccessToken = yield generateAccessTokenFromRefreshTokenPayload(refreshTokenPayload);
        res.json({
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        next(error);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyCurrentPassword(req.authData.userId, req.body.password);
        yield updatePassword(req.authData.userId, req.body.newPassword);
        res.json({
            message: "Password updated successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleUserRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        console.log("ticket", ticket);
        const { name, email, picture } = ticket.getPayload();
        const newUser = yield createNewUser({
            email: email,
            fullName: name,
            avatar: picture,
            verfied: true,
            source: "google",
        });
        const tokens = yield generateAuthTokens(newUser);
        res.json({ user: newUser, tokens });
    }
    catch (error) {
        next(error);
    }
});
const googleUserLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("dd");
        const { token } = req.body;
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        const { email } = ticket.getPayload();
        const user = yield fetchUserFromEmail({ email });
        const tokens = yield generateAuthTokens(user);
        res.json({ user, tokens });
    }
    catch (error) {
        next(error);
    }
});
export default {
    login,
    logout,
    refreshToken,
    resetPassword,
    register,
    googleUserRegister,
    googleUserLogin,
};
