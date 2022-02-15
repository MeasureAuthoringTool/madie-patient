import DOMPurify from "dompurify";

export const sanitizeUserInput = (input) => {
  return DOMPurify.sanitize(input);
};
