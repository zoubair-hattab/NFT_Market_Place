import * as types from '../type';
export const addToCart = (data) => {
  return {
    type: types.ADD_TO_CART,
    payload: data,
  };
};
// remove from cart
export const remove_From_Cart = (id) => {
  return {
    type: types.REMOVE_FROM_CART,
    payload: id,
  };
};
