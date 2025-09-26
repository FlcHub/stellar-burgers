import mockIngredients from '../fixtures/ingredients.json';
import mockOrderResponse from '../fixtures/order-response.json';
import mockUser from '../fixtures/user.json';

const URL = Cypress.env('BURGER_API_URL');

type InferArrayType<T> = T extends (infer U)[] ? U : never;

const findIngredients = (type: string, ingredients: typeof mockIngredients) => {
  return ingredients.filter(el => el.type === type);
}

describe('Конструктор бургера', function() {

  // созданы моковые данные ответа на запрос данных пользователя
  // токены авторизации
  const accessToken = 'nsfhfsdhsfsgyfgsj';
  const refreshToken = 'iytrehdugakldfgyf';
  
  // некоторые константы
  const bun = findIngredients('bun', mockIngredients)[0];
  const ingredient = findIngredients('main', mockIngredients)[0];
  const sauce = findIngredients('sauce', mockIngredients)[0];

  const dataLinkBun = `[data-cy="ingredient_link_${bun._id}"]`;
  const dataModalUI = `[data-cy="modal_ui"]`;
  const dataModalCloseButton = `[data-cy="modal_ui_close_button"]`;
  const dataBurgerConstructorEmpty = `[data-cy="constructor_element_empty"]`;

  const getDataAdd = (id: string) => `[data-cy="add_ingredient_${id}"] button`;
  
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

    cy.setCookie('accessToken', accessToken, { secure: true });
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', refreshToken);
    });

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

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });
  
  it('Модальное окно ингредиента: закрытие по крестику', function() {
    // открыть модальное окно ингредиента и проверить его существование
    cy.ingredientModalOpenWithCheck(dataLinkBun, dataModalUI);

    // закрыть по крестику и проверить, что окна больше нет
    cy.ingredientModalCloseWithCheck(dataModalCloseButton, dataModalUI);
  });
  
  it('Модальное окно ингредиента: закрытие по оверлею', function() {
    // открыть модальное окно ингредиента и проверить его существование
    cy.ingredientModalOpenWithCheck(dataLinkBun, dataModalUI);

    // закрыть по оверлею и проверить, что окна больше нет
    cy.get(`body`).click(10,10);
    cy.get(dataModalUI).should('not.exist');
  });
  
  it('Модальное окно ингредиента: проверка содержимого', function() {
    // открыть модальное окно ингредиента и проверить его существование
    cy.ingredientModalOpenWithCheck(dataLinkBun, dataModalUI);

    const getDataCy = (suffix: string) => `[data-cy="ingredient_${suffix}"]`;
    
    // найти модальное окно и проверить его содержимое
    cy.get(dataModalUI).within(() => {
      cy.get(getDataCy('img')).should('have.attr', 'src', bun.image_large);
      cy.get(getDataCy('name')).contains(bun.name);
      cy.get(getDataCy('calories')).contains(bun.calories);
      cy.get(getDataCy('proteins')).contains(bun.proteins);
      cy.get(getDataCy('fat')).contains(bun.fat);
      cy.get(getDataCy('carbohydrates')).contains(bun.carbohydrates);
    });
    
    cy.ingredientModalCloseWithCheck(dataModalCloseButton, dataModalUI);
  });

  it('Добавление ингредиентов в конструктор', function() {
    // находим в DOM дереве кнопку с атрибутом data-cy=add_ingredient_${bun._id}
    // и кликаем на неё
    cy.get(getDataAdd(bun._id)).click();

    const checkContainer = (obj: InferArrayType<ReturnType<typeof findIngredients>>, suffix: string = '') => {
      cy.get('.constructor-element__text').contains(obj.name + suffix); // текст соответствует
      cy.get('.constructor-element__image').should('have.attr', 'src', obj.image); // картинка соответствует
      cy.get('.constructor-element__price').contains(obj.price); // цена соответствует
    }

    // проверить, добавилась ли булка и какая она
    cy.get(`[data-cy='constructor_element_up']`).within(() => {
      checkContainer(bun, ' (верх)');
    });
    
    cy.get(`[data-cy='constructor_element_dn']`).within(() => {
      checkContainer(bun, ' (низ)');
    });
    
    // проверить, что начинок всё ещё нет
    cy.get(dataBurgerConstructorEmpty).should('be.visible');

    // найти в DOM дереве ингредиенты и кликнуть по ним
    cy.get(getDataAdd(ingredient._id)).click();
    cy.get(getDataAdd(sauce._id)).click();

    const getDataCy = (id: string, ind: number) => `[data-cy="constructor_element${id}_${ind}"]`;
    
    // проверить ингредиенты
    // вверху должен быть ingredient, приписаный в конце индекс = 0
    cy.get(getDataCy(ingredient._id, 0)).within(() => {
      checkContainer(ingredient);
    });
    // за ним идет sauce, приписаный в конце индекс = 1
    cy.get(getDataCy(sauce._id, 1)).within(() => {
      checkContainer(sauce);
    });
  });
  
  it('Оформление заказа', function() {
    cy.get(getDataAdd(bun._id)).click();
    cy.get(getDataAdd(ingredient._id)).click();
    cy.get(getDataAdd(sauce._id)).click();

    // найти кнопку заказа и нажать на неё
    cy.get(`[data-cy="constructor_element_order"] button`).click();

    // проверить наличие модального окна
    cy.get(dataModalUI, { timeout: 2000 }).within(() => {
      cy.get(`[data-cy="order_details_number"]`).contains(mockOrderResponse.order.number);
    });
    
    // закрыть окно и проверить, что оно закрылось
    cy.ingredientModalCloseWithCheck(dataModalCloseButton, dataModalUI);

    // проверить, что конструктор пуст
    cy.get(`[data-cy='constructor_element_bun_up_empty']`).should('be.visible'); // верхней булки нет 
    cy.get(`[data-cy='constructor_element_bun_dn_empty']`).should('be.visible'); // нижней булки нет
    cy.get(dataBurgerConstructorEmpty).should('be.visible'); // начинки нет
  });
});