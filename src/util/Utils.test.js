import { sanitizeUserInput, truncateInput } from "./Utils.js";

describe("Utils tests", () => {
  it("sanitizeUserInput Should remove script", () => {
    const input =
      'Hello tester!<script>alert("Let\'s play hide and seek!")</script>';
    expect(sanitizeUserInput(input)).toBe("Hello tester!");

    const input2 = 'http://testsite.test/<script>alert("TEST");</script>';
    expect(sanitizeUserInput(input2)).toBe("http://testsite.test/");
  });

  it("sanitizeUserInput Should remove script in attributes", () => {
    const input = "<b onmouseover=alert('Wufff!')>click me!</b>";
    expect(sanitizeUserInput(input)).toBe("<b>click me!</b>");

    const input2 =
      'This restaurant is absolutely horrible.<img src="nonexistent.png" onerror="alert(\'This restaurant got voted worst in town!\');" />';
    expect(sanitizeUserInput(input2)).toBe(
      'This restaurant is absolutely horrible.<img src="nonexistent.png">'
    );
  });

  it("sanitizeUserInput Should remove script via encoded URI", () => {
    const input = "<IMG SRC=j&#X41vascript:alert('test2')>";
    expect(sanitizeUserInput(input)).toBe("<img>");
  });

  it("sanitizeUserInput Should remove code encoding", () => {
    const input =
      '<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html;base64,PHNjcmlwdD5hbGVydCgndGVzdDMnKTwvc2NyaXB0Pg">';
    expect(sanitizeUserInput(input)).toBe("");
  });

  it("sanitizeUserInput Should convert back non malicious < and >", () => {
    const input = "4 < A1C < 5 and med use > 3";
    expect(sanitizeUserInput(input)).toBe("4 < A1C < 5 and med use > 3");
  });

  it("truncateInput Should return original value", () => {
    expect(truncateInput(null, 2)).toBeNaN;
    expect(truncateInput("     ", 2)).toBe("     ");
    expect(truncateInput("test test", 10)).toBe("test test");
  });

  it("truncateInput Should truncate original value", () => {
    expect(truncateInput("test test", 4)).toBe("test");
  });
});
