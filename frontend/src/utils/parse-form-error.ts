import { ZodError } from "zod";

export function parseFormError(error: any): Record<string, string> {
  if (error instanceof ZodError) {
    const formErrors: Record<string, string> = {};
    error.errors.forEach((err) => {
      if (err.path && err.path.length > 0) {
        formErrors[err.path.join(".")] = err.message;
      }
    });
    return formErrors;
  }

  if (!error || !error.data || !error.data.formErrors) {
    return {};
  }

  const formErrors: Record<string, string> = {};

  error.data.formErrors.forEach((err: { field: string; message: string }) => {
    formErrors[err.field] = err.message;
  });

  return formErrors;
}
