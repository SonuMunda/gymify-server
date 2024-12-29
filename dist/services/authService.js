var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserModel } from '../models/index.js';
import httpStatus from 'http-status';
import APIError from '../utils/APIError.js';
import bcrypt from 'bcryptjs';
const createNewUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const oldUser = yield UserModel.findOne({ email: user.email.toLowerCase() });
    if (oldUser)
        throw new APIError(httpStatus.BAD_REQUEST, "Email already exists.");
    const newUser = yield UserModel.create(user);
    if (!newUser)
        throw new APIError(httpStatus.BAD_REQUEST, "Oops...seems our server needed a break!");
    return newUser;
});
const createNewGoogleUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, email, firstName, lastName, profilePhoto }) {
    const oldUser = yield UserModel.findOne({ email: email.toLowerCase() });
    if (oldUser)
        throw new APIError(httpStatus.BAD_REQUEST, "Email already exists.");
    const newUser = yield UserModel.create({ email, source: "google" });
    if (!newUser)
        throw new APIError(httpStatus.BAD_REQUEST, "Oops...seems our server needed a break!");
    return newUser;
});
const fetchUserFromEmailAndPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const user = yield UserModel.findOne({
        email: email.toLowerCase(),
    })
        .lean();
    if (!user)
        throw new APIError(httpStatus.BAD_REQUEST, 'invalid credentials');
    let passwordMatches = yield bcrypt.compare(password, user.password);
    if (!passwordMatches)
        throw new APIError(httpStatus.BAD_REQUEST, 'invalid credentials');
    return user;
});
const fetchUserFromEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email }) {
    const user = yield UserModel.findOne({
        email: email.toLowerCase(),
    })
        .lean();
    if (!user)
        throw new APIError(httpStatus.BAD_REQUEST, 'please sign up - this email does not exist');
    return user;
});
const verifyUserFromRefreshTokenPayload = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
    const userExists = yield UserModel.exists({
        _id: userId,
    });
    if (!userExists)
        throw new APIError(httpStatus.FORBIDDEN, 'Invalid Refresh Token - logout');
});
const fetchUserFromAuthData = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
    const user = yield UserModel.findOne({
        _id: userId,
    })
        .lean();
    if (!user)
        throw new APIError(httpStatus.UNAUTHORIZED, 'invalid access token user');
    return user;
});
const verifyCurrentPassword = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel.findOne({
        _id: userId,
    })
        .select('password')
        .lean();
    let passwordMatches = yield bcrypt.compare(password, user.password);
    if (!passwordMatches)
        throw new APIError(httpStatus.BAD_REQUEST, 'invalid current password');
});
const updatePassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let newHash = yield bcrypt.hash(newPassword, 10);
    let user = yield UserModel.findOneAndUpdate({
        _id: userId,
    }, {
        password: newHash,
    }, {
        new: true,
    });
    if (!user)
        throw new APIError(httpStatus.BAD_REQUEST, 'Oops...seems our server needed a break!');
});
export { fetchUserFromEmailAndPassword, fetchUserFromEmail, verifyUserFromRefreshTokenPayload, fetchUserFromAuthData, verifyCurrentPassword, updatePassword, createNewUser, createNewGoogleUser };
