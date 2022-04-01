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

export const truncateInput = (input, length) => {
  if (input != null && input.trim() !== "" && input.length > length) {
    return input.substring(0, length);
  }
  return input;
};
