import * as types from '../type';
const initialState = { logout: false };

export const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.WEB3_LOADED:
      return {
        ...state,
        connection: action.payload,
      };
    case types.WALLET_ADDRESS_LOADED:
      return {
        ...state,
        account: action.payload,
      };

    default:
      return state;
  }
};
