import * as types from '../type';
const initialState = {
  cart: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
};
export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_TO_CART:
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i.token === item.token);
      if (isItemExist) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.token === isItemExist.token ? item : i
          ),
        };
      } else {
        state = {
          ...state,
          cart: [...state.cart, item],
        };
        localStorage.setItem('cartItems', JSON.stringify(state.cart));
        return state;
      }

    case types.REMOVE_FROM_CART:
      const id = action.payload;
      const cart = state.cart.filter((item) => item.token !== id);
      state = {
        ...state,
        cart: cart,
      };
      localStorage.setItem('cartItems', JSON.stringify(state.cart));
      return state;

    default:
      return state;
  }
};
