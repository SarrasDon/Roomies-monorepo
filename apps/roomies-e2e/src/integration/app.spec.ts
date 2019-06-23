import { getGreeting } from '../support/app.po';

describe('roomies', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to roomies!');
  });
});
