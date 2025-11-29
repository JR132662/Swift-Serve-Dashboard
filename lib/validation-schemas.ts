import * as z from "zod"

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  // For login we don't enforce client-side min length so server controls credential errors.
  password: z.string(),
})