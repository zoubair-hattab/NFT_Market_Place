import * as types from '../type';
const initialState = {};
export const marketReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NFT_MARKETPLACE_CONTRACT_LOADED:
      return {
        ...state,
        contract: action.payload,
      };
    case types.MINTED_NFT_LOADED:
      return {
        ...state,
        mintedNFT: action.payload,
      };
    case types.OWNED_NFT_LOADED:
      return {
        ...state,
        ownedNFT: action.payload,
      };
    case types.UNSOLD_NFT_LOADED:
      return {
        ...state,
        unsoldNFT: action.payload,
      };

    case types.MINTED_SUCCESSFULLY:
      var nftList;
      if (state.unsoldNFT) {
        nftList = [...state.unsoldNFT, action.payload];
      } else {
        nftList = [action.payload];
      }
      return {
        ...state,
        unsoldNFT: nftList,
      };

    case types.PURCHASED_SUCCESSFULLY:
      return {
        ...state,
        unsoldNFT: state.unsoldNFT.filter(
          (data) => data.token !== action.payload
        ),
      };

    default:
      return state;
  }
};
