import isNil from 'lodash.isnil';
import { NextFunction, Request, Response, Router } from 'express';

export abstract class BaseRouter {
  public router = Router();

  protected constructor() {
    this.initializeRoutes();
  }

  protected registerGetHandler(
    path: string,
    handler: (request: Request, response: Response, next: NextFunction) => void,
  ): void {
    if (isNil(path) || typeof handler !== 'function') {
      throw new Error(`Expected path and function handler, got "${path}, ${handler}"`);
    }
    this.router.get(path, handler);
  }

  protected registerPostHandler(
    path: string,
    handler: (request: Request, response: Response, next: NextFunction) => void,
  ): void {
    if (isNil(path) || typeof handler !== 'function') {
      throw new Error(`Expected path and function handler, got "${path}, ${handler}"`);
    }
    this.router.post(path, handler);
  }

  abstract initializeRoutes(): void;
}
