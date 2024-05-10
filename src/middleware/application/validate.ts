import { Request, Response, NextFunction } from "express";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { ValidationError } from "../../utils/errors";

export function validateInput(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parse = schema.safeParse(req.body);
    if (!parse.success)
      throw new ValidationError([fromZodError(parse.error).message]);
    next();
  };
}
