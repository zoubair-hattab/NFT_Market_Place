import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, NftPage, MyItemPage, MyOrderPage } from './routes/routes.js';
import { useEffect, useState } from 'react';
import {
  loadContracts,
  loadMintedNFT,
  loadOwnedNFT,
  loadUnsoldNFT,
  loadWeb3,
} from './redux/interaction.js';
import { useDispatch, useSelector } from 'react-redux';
import {
  chainOrAccountChangedHandler,
  connectWallet,
} from './helper/helper.js';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const { connection } = useSelector((state) => state.web3Reducer);
  const dispatch = useDispatch();
  const [network, setNetwork] = useState(false);
  useEffect(() => {
    const loadBlockchain = async () => {
      try {
        const provider = await loadWeb3(dispatch);
        const { chainId } = await provider.getNetwork();
        if (chainId !== 11155111n) {
          setNetwork(true);
        }
        const addresses = await provider.listAccounts();
        const contracts = await loadContracts(provider, dispatch);
        await loadUnsoldNFT(
          provider,
          contracts.marketplace,
          contracts.nft,
          dispatch
        );
        await loadOwnedNFT(
          provider,
          contracts.marketplace,
          addresses[0]?.address,
          contracts.nft,
          dispatch
        );

        await loadMintedNFT(
          provider,
          contracts.marketplace,
          addresses[0]?.address,
          contracts.nft,
          dispatch
        );
      } catch (error) {
        console.log(error.message);
      }
    };
    loadBlockchain();
  }, [dispatch]);

  useEffect(() => {
    // listen for account changes
    window?.ethereum?.on('accountsChanged', chainOrAccountChangedHandler);
    // Listen for chain change
    window?.ethereum?.on('chainChanged', chainOrAccountChangedHandler);
  }, []);

  const connect = async () => {
    connectWallet(connection, dispatch);
  };
  return (
    <BrowserRouter>
      {network && network && (
        <div className="py-3 w-full bg-red-500 text-xl text-white z-50 fixed top-[75px] left-0">
          <div className="container text-center">
            Please you network{' '}
            <span className="text-primary text-lg " onClick={() => connect()}>
              switch
            </span>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="create" element={<NftPage />} />
          <Route path="my_items" element={<MyItemPage />} />
          <Route path="my_orders" element={<MyOrderPage />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
