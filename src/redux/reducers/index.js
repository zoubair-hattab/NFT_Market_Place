import { combineReducers } from 'redux';
import { web3Reducer } from './web3Reducer';
import { nftReducer } from './nftReducer';
import { marketReducer } from './marketReducer';
import { cartReducer } from './cartReducer';

export default combineReducers({
  web3Reducer,
  nftReducer,
  marketReducer,
  cartReducer,
});
