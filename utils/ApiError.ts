class ApiError extends Error {
  statusCode: number;
  type: string;
  uuid: string;

  constructor(statusCode: number, message: string, type: string = 'API Error', uuid: string = '') {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.uuid = uuid;
  }
}

export default ApiError;
