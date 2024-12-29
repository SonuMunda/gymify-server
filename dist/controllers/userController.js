var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUserFromId, getUserFromUsername } from "../services/userService.js";
const getUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.authData.userId;
    try {
        const user = yield getUserFromId(userId);
        const responseUser = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            username: user.username,
            about: user.about,
        };
        console.log("responseUser", responseUser);
        res.status(200).json({ user: responseUser });
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.authData.userId;
    const { fullName, username, about } = req.body;
    try {
        console.log("userId", userId);
        const user = yield getUserFromId(userId);
        Object.assign(user, { fullName, username, about });
        yield user.save();
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
const checkUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    try {
        const user = yield getUserFromUsername(username);
        return res.status(200).json({
            available: !user,
            message: user ? "Username already exists" : "Username is available",
        });
    }
    catch (error) {
        next(error);
    }
});
const updateAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.authData.userId;
    const { avatar } = req.body;
    try {
        const user = yield getUserFromId(userId);
        user.avatar = avatar;
        yield user.save();
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
export default {
    getUserInfo,
    updateUser,
    checkUsername,
    updateAvatar,
};
