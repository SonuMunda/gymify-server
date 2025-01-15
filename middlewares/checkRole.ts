import { errorResponse } from "../utils/ResponseHelpers";

export const checkRole = (role: string) => {
  return (req: any, res: any, next: any) => {
    try {
      console.log("req.authData", req.authData);
      if (!req.authData || !req.authData.role) {
        errorResponse(res, "Access Denied, User role not found", 401);
        return;
      }

      if (req.authData.role !== role) {
        errorResponse(
          res,

          `Access denied: ${role} rights required`,
          401
        );
        return;
      }

      next();
    } catch (error: any) {
      errorResponse(res, "Access Denied", 401, error);
      return;
    }
  };
};
