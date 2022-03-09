export interface APIErrorStatus {
  code: string;
  errorMessage: string;
  httpStatusCode: string;
}

export interface APIErrorStatusResponse {
  errorStatus: APIErrorStatus;
}
