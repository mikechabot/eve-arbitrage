import { HTTPError } from 'ky';

import { ErrorMapperFn, ServiceErrorFactory } from './ServiceErrorFactory';

function isApiErrorResponse(e: unknown) {
  return (e as HTTPError)?.response?.json !== undefined;
}

/**
 * Helper function that wraps API fetch calls around a try/catch to provide a consistent internal Web3ServiceError object.
 * @param fn
 * @param errorMapperFn
 */
export const processServiceCall = async <ApiReturn>(
  fn: () => ApiReturn | PromiseLike<ApiReturn>,
  errorMapperFn?: ErrorMapperFn,
): Promise<ApiReturn> => {
  try {
    return await Promise.resolve(fn());
  } catch (e: unknown) {
    /**
     * Attempt to pull data from the response object
     */
    if (isApiErrorResponse(e)) {
      let response;
      try {
        response = await (e as HTTPError).response.json();
        /**
         * In case "json()" fails, swallow to be handled more generally below
         */
        // eslint-disable-next-line no-empty
      } catch {}

      throw ServiceErrorFactory.create<ApiReturn>(e as Error | HTTPError, response, errorMapperFn);
    }

    throw ServiceErrorFactory.create<ApiReturn>(e as Error | HTTPError, undefined, errorMapperFn);
  }
};
