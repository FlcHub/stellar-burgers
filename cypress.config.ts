import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: '**/*.cy.{js,jsx,ts,tsx}', // Changed pattern
    env: {
      BURGER_API_URL: 'https://norma.nomoreparties.space/api',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: 'cypress/support/e2e.ts'
  },
});
