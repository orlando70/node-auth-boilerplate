import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string(),
    password: z.string(),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .strict();

  export const screenSchema = z
  .object({
    name: z.string(),
    code: z.string(),
  })

  export const forgotPasswordSchema = z.object({
    email: z.string(),
  });