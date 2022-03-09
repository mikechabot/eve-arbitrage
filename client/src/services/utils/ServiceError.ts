export const ServiceErrorCode = {
  Unrecognized: 'APP-999',
  Banned: 'QRS-401',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ServiceErrorCode = typeof ServiceErrorCode[keyof typeof ServiceErrorCode];

export interface BanServerError {
  errorStatus: ServiceErrorCode;
  banLiftDate: Date;
}

interface ServiceErrorInput {
  code?: string;
  errorMessage?: string;
  innerError?: Error;
}

export class ServiceError extends Error {
  public code: ServiceErrorCode;

  public errorMessage: string;

  public innerError?: Error;

  constructor({
    code = ServiceErrorCode.Unrecognized,
    errorMessage = undefined,
    innerError = undefined,
  }: ServiceErrorInput = {}) {
    super();

    const errorMsg = errorMessage || 'An unknown error has occurred.';

    this.name = code;
    this.code = code as ServiceErrorCode;
    this.errorMessage = errorMsg;
    this.message = `ServiceError: ${errorMsg} (code: ${code})`;
    this.innerError = innerError;
  }
}
