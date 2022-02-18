import DOMPurify from "dompurify";

export const sanitizeUserInput = (input) => {
  let clean = input;

  if (input != null && input.length > 0) {
    clean = DOMPurify.sanitize(input);

    clean = clean
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  }
  return clean;
};
