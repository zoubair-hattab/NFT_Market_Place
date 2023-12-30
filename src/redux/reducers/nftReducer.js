import * as types from '../type';
const initialState = {};
export const nftReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NFT_CONTRACT_LOADED:
      return {
        ...state,
        contract: action.payload,
      };

    default:
      return state;
  }
};
