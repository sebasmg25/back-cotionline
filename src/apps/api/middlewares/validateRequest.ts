import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export class RequestValidator {
  static handle(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    return next();
  }
}
