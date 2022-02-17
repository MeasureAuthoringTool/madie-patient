import { sanitizeUserInput } from "./Utils.js";

describe("Utils sanitizeUserInput test", () => {
  it("Should remove script", () => {
    const input =
      'Hello tester!<script>alert("Let\'s play hide and seek!")</script>';
    expect(sanitizeUserInput(input)).toBe("Hello tester!");

    const input2 = 'http://testsite.test/<script>alert("TEST");</script>';
    expect(sanitizeUserInput(input2)).toBe("http://testsite.test/");
  });

  it("Should remove script in attributes", () => {
    const input = "<b onmouseover=alert('Wufff!')>click me!</b>";
    expect(sanitizeUserInput(input)).toBe("<b>click me!</b>");

    const input2 =
      'This restaurant is absolutely horrible.<img src="nonexistent.png" onerror="alert(\'This restaurant got voted worst in town!\');" />';
    expect(sanitizeUserInput(input2)).toBe(
      'This restaurant is absolutely horrible.<img src="nonexistent.png">'
    );
  });

  it("Should remove script via encoded URI", () => {
    const input = "<IMG SRC=j&#X41vascript:alert('test2')>";
    expect(sanitizeUserInput(input)).toBe("<img>");
  });

  it("Should remove code encoding", () => {
    const input =
      '<META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html;base64,PHNjcmlwdD5hbGVydCgndGVzdDMnKTwvc2NyaXB0Pg">';
    expect(sanitizeUserInput(input)).toBe("");
  });
});
