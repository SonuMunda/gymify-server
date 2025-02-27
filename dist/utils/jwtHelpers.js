var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
const sign = (payload, secret) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, (error, token) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(token);
            }
        });
    });
});
const verify = (token, secret) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, payload) => {
            if (error) {
                resolve(null);
            }
            else {
                resolve(payload);
            }
        });
    });
});
export { sign, verify };
