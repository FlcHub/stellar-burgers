/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      ingredientModalOpenWithCheck(linkSelector: string, modalSelector: string): Chainable;
      ingredientModalCloseWithCheck(xSelector: string, modalSelector: string): Chainable;
    }
  }
}

export {};
