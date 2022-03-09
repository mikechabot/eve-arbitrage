import { HTTPError } from 'ky';
import { APIErrorStatusResponse, APIErrorStatus } from 'services/types/shared-api';

import { ServiceError } from './ServiceError';

export type ErrorMapperFn = <ApiReturn>(e: HTTPError | Error, response?: ApiReturn) => ServiceError;

export class ServiceErrorFactory {
  /**
   * If there's a mapper function, immediately pipe the error and the response to it.
   *
   * If not, cast the error to "APIErrorStatusResponse" and check for "errorStatus", if present,
   * create an error from the endpoint response.
   *
   * If not an API response, return a generic Web3ServiceError; this could be due to a JS error
   * or server down, etc.
   * @param e
   * @param response
   * @param mapperFn
   */
  static create<ApiReturn>(
    e: HTTPError | Error,
    response?: ApiReturn | APIErrorStatusResponse,
    mapperFn?: ErrorMapperFn,
  ): ServiceError {
    if (mapperFn) {
      return mapperFn(e, response as ApiReturn);
    }
    const apiResponse = response as APIErrorStatusResponse;
    if (apiResponse?.errorStatus) {
      return this.createErrorFromApiResponse(e, apiResponse.errorStatus);
    }
    return this.createGeneric(e);
  }

  /**
   * Certain endpoints respond with varying types of error statuses; create
   * an error from the response.
   * @param e
   * @param errorStatus
   */
  private static createErrorFromApiResponse(e: HTTPError | Error, errorStatus: APIErrorStatus) {
    return new ServiceError({
      code: errorStatus.code,
      errorMessage: errorStatus.errorMessage,
      innerError: e,
    });
  }

  /**
   * Create a generic Web3ServiceError
   * @param e
   * @private
   */
  private static createGeneric(e: HTTPError | Error) {
    return new ServiceError({ innerError: e });
  }
}
