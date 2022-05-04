describe("feeds", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to add a new feed", () => {
    cy.login();

    cy.visit("/feeds/new");

    cy.findByRole("textbox").type("https://www.wired.com/feed/rss");
    cy.findByRole("button", { name: /save/i }).click();

    cy.url().should("include", "/feeds");
    cy.findByRole("heading").should("contain", "Wired");
  });
});
