interface ApiResponse {
  status: "success" | "error";
  message: string;
  code: number;
  response?: any;
  payload?: any;
  stackTrace?: string;
}

export function successResponse(
  response: any,
  message: string,
  payload: any = {},
  code: number = 200
): ApiResponse {
  const result: ApiResponse = {
    status: "success",
    message,
    code,
    payload,
  };

  return response.status(code).json(result);
} 

export function errorResponse(
  response: any,
  message: string,
  code: number = 400,
  error?: Error
): ApiResponse {
  const result: ApiResponse = {
    status: "error",
    message,
    code,
    stackTrace: error ? error.stack : undefined,
  };

  return response.status(code).json(result);
}
