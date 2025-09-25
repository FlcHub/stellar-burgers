import mockIngredients from '../fixtures/ingredients.json';
import mockOrderResponse from '../fixtures/order-response.json';
import mockUser from '../fixtures/user.json';

import { setCookie, deleteCookie } from '../../src/utils/cookie';

const URL = Cypress.env('BURGER_API_URL');

const find_ingredients = (type: string, ingredients: typeof mockIngredients) => {
  return ingredients.filter(el => el.type === type);
}

describe('Конструктор бургера', function() {

  // созданы моковые данные ответа на запрос данных пользователя
  // токены авторизации
  const accessToken = 'nsfhfsdhsfsgyfgsj';
  const refreshToken = 'iytrehdugakldfgyf';
  
  // перехват запросов к бэкенду
  beforeEach(() => {
    // перехватить GET-запрос по адресу URL/ingredients
    cy.intercept('GET', `${URL}/ingredients`, {
      status: 200,
      body: {
        success: true,
        data: mockIngredients
      }
    });

    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // перехватить GET-запрос по адресу URL/auth/user
    cy.intercept('GET', `${URL}/auth/user`, {
      status: 200,
      body: {
        success: true,
        user: mockUser
      }
    });

    // перехватить POST-запрос по адресу URL/orders
    cy.intercept('POST', `${URL}/orders`, {
      delayMs: 1000,
      status: 200,
      body: mockOrderResponse,
    }).as('makeOrder');
    
    cy.visit('http://localhost:4000');
  });

  this.afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
  
  it('Модальное окно ингредиента: закрытие по крестику', function() {
    const bun = find_ingredients('bun', mockIngredients)[0];

    // найти картинку булки и кликнуть по ней
    cy.get(`[data-cy="ingredient_link_${bun._id}"]`).click();

    // проверить, что окно существует
    cy.get(`[data-cy="modal_ui"]`).should('be.visible');

    // закрыть по крестику и проверить, что окна больше нет
    cy.get(`[data-cy="modal_ui_close_button"]`).click();
    cy.get(`[data-cy="modal_ui"]`).should('not.exist');
  });
  
  it('Модальное окно ингредиента: закрытие по оверлею', function() {
    const bun = find_ingredients('bun', mockIngredients)[0];

    // найти картинку булки и кликнуть по ней
    cy.get(`[data-cy="ingredient_link_${bun._id}"]`).click();

    // проверить, что окно существует
    cy.get(`[data-cy="modal_ui"]`).should('be.visible');

    // закрыть по оверлею и проверить, что окна больше нет
    cy.get(`body`).click(10,10);
    cy.get(`[data-cy="modal_ui"]`).should('not.exist');
  });
  
  it('Модальное окно ингредиента: проверка содержимого', function() {
    const bun = find_ingredients('bun', mockIngredients)[0];

    // найти картинку булки и кликнуть по ней
    cy.get(`[data-cy="ingredient_link_${bun._id}"]`).click();

    // найти модальное окно и проверить его содержимое
    cy.get(`[data-cy="modal_ui"]`).within(() => {
      cy.get(`[data-cy="ingredient_img"]`).should('have.attr', 'src', bun.image_large);
      cy.get(`[data-cy="ingredient_name"]`).contains(bun.name);
      cy.get(`[data-cy="ingredient_calories"]`).contains(bun.calories);
      cy.get(`[data-cy="ingredient_proteins"]`).contains(bun.proteins);
      cy.get(`[data-cy="ingredient_fat"]`).contains(bun.fat);
      cy.get(`[data-cy="ingredient_carbohydrates"]`).contains(bun.carbohydrates);
    });
    
    cy.get(`[data-cy="modal_ui_close_button"]`).click();
  });

  it('Добавление ингредиентов в конструктор', function() {
    const buns = find_ingredients('bun', mockIngredients);
    const ingredients = find_ingredients('main', mockIngredients);
    const sauces = find_ingredients('sauce', mockIngredients);

    const bun = buns[0];

    // находим в DOM дереве кнопку с атрибутом data-cy=add_ingredient_${bun._id}
    // и кликаем на неё
    cy.get(`[data-cy="add_ingredient_${bun._id}"] button`).click();

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
  
  it('Оформление заказа', function() {
    const buns = find_ingredients('bun', mockIngredients);
    const ingredients = find_ingredients('main', mockIngredients);
    const sauces = find_ingredients('sauce', mockIngredients);

    cy.get(`[data-cy="add_ingredient_${buns[0]._id}"] button`).click();
    cy.get(`[data-cy="add_ingredient_${ingredients[0]._id}"] button`).click();
    cy.get(`[data-cy="add_ingredient_${sauces[0]._id}"] button`).click();

    // найти кнопку заказа и нажать на неё
    cy.get(`[data-cy="constructor_element_order"] button`).click();

    // проверить наличие модального окна
    cy.get(`[data-cy="modal_ui"]`, { timeout: 2000 }).within(() => {
      cy.get(`[data-cy="order_details_number"]`).contains(mockOrderResponse.order.number);
    });
    
    // закрыть окно и проверить, что оно закрылось
    cy.get(`[data-cy="modal_ui_close_button"]`).click();
    cy.get(`[data-cy="modal_ui"]`).should('not.exist');

    // проверить, что конструктор пуст
    cy.get(`[data-cy='constructor_element_bun_up_empty']`).should('be.visible'); // верхней булки нет 
    cy.get(`[data-cy='constructor_element_bun_dn_empty']`).should('be.visible'); // нижней булки нет
    cy.get(`[data-cy="constructor_element_empty"]`).should('be.visible'); // начинки нет
  });
});