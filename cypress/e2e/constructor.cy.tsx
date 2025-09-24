import mockIngredients from '../fixtures/ingredients.json';

const URL = Cypress.env('BURGER_API_URL');

const find_ingredients = (type: string, ingredients: typeof mockIngredients) => {
  return ingredients.filter(el => el.type === type);
}

describe('Конструктор бургера', function() {
  // перехват запросов к бэкенду
  
  // перехватить GET-запрос по адресу URL/api/ingredients
  beforeEach(() => {
    cy.intercept('GET', `${URL}/ingredients`, {
      status: 200,
      body: {
        success: true,
        data: mockIngredients
      }
    });
    
    cy.visit('http://localhost:4000');
  });

  it('Добавление ингредиентов в конструктор', function() {
    const buns = find_ingredients('bun', mockIngredients);
    const ingredients = find_ingredients('main', mockIngredients);
    const sauces = find_ingredients('sauce', mockIngredients);

    const bun = buns[0];

    // находим в DOM дереве кнопку с атрибутом data-cy=add_ingredient_${bun._id}
    const button_bun = cy.get(`[data-cy="add_ingredient_${bun._id}"] button`);
    // кликаем на кнопку, чтобы добавить булку
    button_bun.click();

    // проверить, добавилась ли булка и какая она
    cy.get(`[data-cy='constructor_element_up']`).within(() => {
      cy.get('.constructor-element__text').contains(bun.name + ' (верх)'); // текст соответствует
      cy.get('.constructor-element__image').should('have.attr', 'src', bun.image);  // картинка соответствует
      cy.get('.constructor-element__price').contains(bun.price); // цена соответствует
    });
    
    cy.get(`[data-cy='constructor_element_dn']`).within(() => {
      cy.get('.constructor-element__text').contains(bun.name + ' (низ)'); // текст соответствует
      cy.get('.constructor-element__image').should('have.attr', 'src', bun.image);  // картинка соответствует
      cy.get('.constructor-element__price').contains(bun.price); // цена соответствует
    });
    
    // проверить, что начинок всё ещё нет
    cy.get(`[data-cy="constructor_element_empty"]`).should('be.visible');

    // находим в DOM дереве ингредиенты и кликнуть по ним
    cy.get(`[data-cy="add_ingredient_${ingredients[0]._id}"] button`).click();
    cy.get(`[data-cy="add_ingredient_${sauces[0]._id}"] button`).click();

    // проверить ингредиенты
    // вверху должен быть ingredients[0], приписаный в конце индекс = 0
    cy.get(`[data-cy="constructor_element${ingredients[0]._id}_0"]`).within(() => {
      cy.get('.constructor-element__text').contains(ingredients[0].name);
      cy.get('.constructor-element__image').should('have.attr', 'src', ingredients[0].image);
      cy.get('.constructor-element__price').contains(ingredients[0].price);
    });
    // за ним идет sauces[0], приписаный в конце индекс = 1
    cy.get(`[data-cy="constructor_element${sauces[0]._id}_1"]`).within(() => {
      cy.get('.constructor-element__text').contains(sauces[0].name);
      cy.get('.constructor-element__image').should('have.attr', 'src', sauces[0].image);
      cy.get('.constructor-element__price').contains(sauces[0].price);
    });
  });
});