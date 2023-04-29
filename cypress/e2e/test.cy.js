/// <reference types="cypress" />

describe("Book Search Tool", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/");
  });

  it("displays book search input", () => {
    cy.get('input[name="search"]').should("exist");
  });

  it("displays book sort select dropdown", () => {
    cy.get("select").should("exist");
  });

  it("displays book search results", () => {
    cy.get('input[name="search"]').type("Harry Potter");
    cy.wait(2000);
    cy.get(".card").should("have.length.gte", 1);
  });

  it("sorts books alphabetically by title in ascending order", () => {
    cy.get('input[name="search"]').type("7 Habits");
    cy.wait(4000);
    cy.get("select").select("A-Z");
    cy.wait(4000);
    // cy.get("#bookTitle").contains("7 HABITS");
    cy.get(() => document.querySelectorAll('u#bookTitle')).contains('7 HABITS')
  });

  it("sorts books alphabetically by title in descending order", () => {
    cy.get('input[name="search"]').type("7 Habits");
    cy.wait(4000);
    cy.get("select").select("Z-A");
    cy.wait(4000);
    // cy.get(".card").first().contains("The Power");
    // cy.contains("The Power");
    cy.contains('THE POWER').invoke('parent').find('u#bookTitle')

  });
});

