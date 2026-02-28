import { formatWelcomeMessage } from "./index";

describe("formatWelcomeMessage", () => {
  it("should include the user name", () => {
    const user = { id: 1, name: "Alice", email: "alice@example.com" };
    const message = formatWelcomeMessage(user);
    expect(message).toContain("Alice");
  });

  it("should include today's date", () => {
    const user = { id: 1, name: "Alice", email: "alice@example.com" };
    const message = formatWelcomeMessage(user);
    // The message should contain the year at minimum
    expect(message).toContain(new Date().getFullYear().toString());
  });
});
