import httpStatus from "http-status";
import APIError from "../utils/ApiError";

export const checkRole = (role: string) => {
  return (req: any, res: any, next: any) => {
    try {
      if (!req.authData || !req.authData.role) {
        throw new APIError(
          httpStatus.FORBIDDEN,
          "Access denied: User role not found"
        );
      }

      if (req.authData.role !== role) {
        throw new APIError(
          httpStatus.FORBIDDEN,
          `Access denied: ${role} rights required`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
