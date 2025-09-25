import { expect } from '@jest/globals';
import shopSliceReducer, {
  addIngredient,
  deleteIngredient,
  initialState,
  moveIngredient
} from './shopSlice';
import {
  bunIngredientOne,
  bunIngredientTwo,
  fillIngredient,
  ingredientsAfterDelete,
  ingredientsBefore,
  ingredientsMovedAfterDn,
  ingredientsMovedAfterUp,
  mockIngredients
} from './test-data';

const burgerConstructorWithBun = {
  bun: { ...bunIngredientOne },
  ingredients: []
};

describe('Работа редьюсера конструктора бургера', () => {
  test('Добавление булки в конструктор бургера', () => {
    const { ingredients: _, ...restState } = initialState;
    const initialIngredientsState = {
      ingredients: mockIngredients,
      ...restState
    };

    // Добавить булочку
    const newState = shopSliceReducer(
      initialIngredientsState,
      addIngredient(bunIngredientOne)
    );

    // Получить конструктор из нового состояния
    const { constructorItems } = newState;

    // Сравнить результат с ожидаемым значением
    expect(burgerConstructorWithBun).toEqual(constructorItems);
  });

  test('Добавление новой булки в конструктор бургера подменяет предыдущую булку', () => {
    const { ingredients: _, ...restState } = initialState;
    const initialIngredientsState = {
      ingredients: mockIngredients,
      ...restState
    };

    // Добавить булочку
    const newState = shopSliceReducer(
      initialIngredientsState,
      addIngredient(bunIngredientOne)
    );

    // Получить конструктор из нового состояния
    const { constructorItems } = newState;

    // Сравнить результат с ожидаемым значением
    expect(burgerConstructorWithBun).toEqual(constructorItems);

    // Заменить булочку
    const secondState = shopSliceReducer(
      newState,
      addIngredient(bunIngredientTwo)
    );

    const BurgerConstructorWithBunTwo = {
      bun: { ...bunIngredientTwo },
      ingredients: []
    };

    expect(BurgerConstructorWithBunTwo).toEqual(secondState.constructorItems);
  });

  test('Добавление ингредиента в конструктор бургера', () => {
    const { ingredients: _, ...restState } = initialState;
    const initialIngredientsState = {
      ingredients: mockIngredients,
      ...restState
    };

    // Добавить булочку
    const newState = shopSliceReducer(
      initialIngredientsState,
      addIngredient(fillIngredient)
    );

    // Получить конструктор из нового состояния
    const { constructorItems } = newState;

    // Ожидаемы результат содержит fillIngredient и неважно какой id
    const burgerConstructorWithFill = {
      bun: null,
      ingredients: [{ id: expect.any(String), ...fillIngredient }]
    };

    // Сравнить результат с ожидаемым значением
    expect(burgerConstructorWithFill).toEqual(constructorItems);
  });

  test('Удаление ингредиента из конструктора бургера', () => {
    const { constructorItems: _, ...restState } = initialState;
    const initialIngredientsState = {
      constructorItems: {
        bun: null,
        ingredients: ingredientsBefore
      },
      ...restState
    };

    // Удалить второй ингредиент
    const newState = shopSliceReducer(
      initialIngredientsState,
      deleteIngredient(1)
    );
    const { constructorItems } = newState;
    expect(ingredientsAfterDelete).toEqual(constructorItems.ingredients);
  });

  test('Перемещение самого вверхнего ингредиента вверх не меняет состояния конструктора', () => {
    const { constructorItems: _, ...restState } = initialState;
    const initialIngredientsState = {
      constructorItems: {
        bun: null,
        ingredients: ingredientsBefore
      },
      ...restState
    };

    // Переместить верхний ингредиент вверх
    const newState = shopSliceReducer(
      initialIngredientsState,
      moveIngredient({ index: 0, moveDirection: -1 })
    );
    const { constructorItems } = newState;
    expect(ingredientsBefore).toEqual(constructorItems.ingredients);
  });

  test('Перемещение самого нижнего ингредиента вниз не меняет состояния конструктора', () => {
    const { constructorItems: _, ...restState } = initialState;
    const initialIngredientsState = {
      constructorItems: {
        bun: null,
        ingredients: ingredientsBefore
      },
      ...restState
    };

    // Переместить нижний ингредиент вниз
    const newState = shopSliceReducer(
      initialIngredientsState,
      moveIngredient({ index: ingredientsBefore.length - 1, moveDirection: 1 })
    );
    const { constructorItems } = newState;
    expect(ingredientsBefore).toEqual(constructorItems.ingredients);
  });

  test('Перемещение не крайнего ингредиента вверх по списку в конструкторе', () => {
    const { constructorItems: _, ...restState } = initialState;
    const initialIngredientsState = {
      constructorItems: {
        bun: null,
        ingredients: ingredientsBefore
      },
      ...restState
    };

    // Переместить второй ингредиент вверх
    const newState = shopSliceReducer(
      initialIngredientsState,
      moveIngredient({ index: 1, moveDirection: -1 })
    );
    const { constructorItems } = newState;
    expect(ingredientsMovedAfterUp).toEqual(constructorItems.ingredients);
  });

  test('Перемещение не крайнего ингредиента вниз по списку в конструкторе', () => {
    const { constructorItems: _, ...restState } = initialState;
    const initialIngredientsState = {
      constructorItems: {
        bun: null,
        ingredients: ingredientsBefore
      },
      ...restState
    };

    // Переместить второй ингредиент вниз
    const newState = shopSliceReducer(
      initialIngredientsState,
      moveIngredient({ index: 1, moveDirection: 1 })
    );
    const { constructorItems } = newState;
    expect(ingredientsMovedAfterDn).toEqual(constructorItems.ingredients);
  });
});
