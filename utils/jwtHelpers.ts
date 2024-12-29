import jwt from "jsonwebtoken";

const sign = async (payload: any, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, (error: any, token: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
};

const verify = async (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
};

export { sign, verify };
