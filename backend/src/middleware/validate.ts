import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const validate =
  (schema: any) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "fail",
          errors: error,
        });
        return;
      }
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  };
