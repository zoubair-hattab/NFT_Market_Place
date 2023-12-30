import { ethers } from 'ethers';
import { web3Loaded, walletAddressLoaded } from './actions/web3Action';
import axios from 'axios';
import {
  mintedNFTLoaded,
  nftContractLoaded,
  nftMarketplaceContractLoaded,
  nftPurchased,
  ownedNFTLoaded,
  unsoldNFTLoaded,
} from './actions/nftAction';
import NFTMarketContract from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import NFTContract from '../artifacts/contracts/NFTToken.sol/NFTToken.json';
import { etherToWei, weiToEther } from '../helper/helper';
import { toast } from 'react-toastify';
import { remove_From_Cart } from './actions/cartAction';
var marketPlaceAddress = '0x8390dC7C677FB5067bbbE508adF0E162CE36b2B5';
var nftAddress = '0xF1F4615910a0138cAD039efD7880D37f2aD4624b';

export const formatNFTData = async (data, nftContract) => {
  const tokenUri = await nftContract.tokenURI(data.token);
  const meta = await axios.get(tokenUri);

  const formattedData = {
    name: meta.data.name,
    image: meta.data.image,
    desc: meta.data.description,
    price: weiToEther(data.price),
    token: data.token.toString(),
    creator: data.creator,
    type: meta.data.type,
  };

  return formattedData;
};
export const networks = {
  11155111: {
    chainId: '0xAA36A7',
    chainName: 'soplia Network',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc2.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
};

export const loadWeb3 = async (dispatch) => {
  try {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      dispatch(web3Loaded(provider));
      const addresses = await provider.listAccounts();
      dispatch(walletAddressLoaded(addresses[0]));
      return provider;
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export const loadAccount = async (provider, dispatch) => {
  try {
    if (!provider) {
      return;
    }
    const { chainId } = await provider?.getNetwork();
    if (chainId && chainId !== 11155111n) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networks[11155111].chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [networks[11155111]],
            });
          } catch (addError) {
            if (addError.code === 4001) {
              console.error('Please approve Songbird network.');
            } else {
              console.error(addError);
            }
          }
        } else {
          console.error(switchError);
        }
      }
    }
    const signer = await provider.getSigner();
    const connectedWallet = await signer.getAddress();
    dispatch(walletAddressLoaded(connectedWallet));
  } catch (error) {
    console.log(error);
  }
};

export const loadContracts = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  if (chainId !== 11155111n) {
    return {
      marketplace: null,
      nft: null,
    };
  }
  var signer;
  const addresses = await provider.listAccounts();
  if (addresses.length > 0) {
    signer = await provider.getSigner();
  } else {
    signer = provider;
  }
  const nftMarketplaceContract = new ethers.Contract(
    marketPlaceAddress,
    NFTMarketContract.abi,
    signer
  );
  const nftContract = new ethers.Contract(nftAddress, NFTContract.abi, signer);

  dispatch(nftMarketplaceContractLoaded(nftMarketplaceContract));
  dispatch(nftContractLoaded(nftContract));

  return {
    marketplace: nftMarketplaceContract,
    nft: nftContract,
  };
};

export const loadUnsoldNFT = async (
  provider,
  marketplaceContract,
  nftContract,
  dispatch
) => {
  const { chainId } = await provider.getNetwork();
  if (chainId !== 11155111n) {
    dispatch(unsoldNFTLoaded([]));
    return;
  }

  var unsoldNft = await marketplaceContract.fetchMarketItems();
  const formattedNFTList = await Promise.all(
    unsoldNft.map((nft) => {
      var res = formatNFTData(nft, nftContract);
      return res;
    })
  );

  dispatch(unsoldNFTLoaded(formattedNFTList));
};

export const loadMintedNFT = async (
  provider,
  marketplaceContract,
  account,
  nftContract,
  dispatch
) => {
  const { chainId } = await provider.getNetwork();
  if (!account || chainId !== 11155111n) {
    dispatch(mintedNFTLoaded([]));
    return;
  }
  var unsoldNft = await marketplaceContract.fetchCreatorItemsListed({
    from: account,
  });

  const formattedNFTList = await Promise.all(
    unsoldNft.map((nft) => {
      var res = formatNFTData(nft, nftContract);
      return res;
    })
  );

  dispatch(mintedNFTLoaded(formattedNFTList));
};

export const loadOwnedNFT = async (
  provider,
  marketplaceContract,
  account,
  nftContract,
  dispatch
) => {
  const { chainId } = await provider.getNetwork();
  if (!account || chainId !== 11155111n) {
    dispatch(ownedNFTLoaded([]));
    return;
  }
  var unsoldNft = await marketplaceContract.fetchOwnerItemsListed({
    from: account,
  });

  const formattedNFTList = await Promise.all(
    unsoldNft.map((nft) => {
      var res = formatNFTData(nft, nftContract);
      return res;
    })
  );

  dispatch(ownedNFTLoaded(formattedNFTList));
};

export const buyNFT = async (
  marketplaceContract,
  account,
  tokenId,
  price,
  dispatch,
  onSuccess,
  onError
) => {
  if (!account) {
    return;
  }
  try {
    var res = await marketplaceContract.buyItem(tokenId, {
      value: etherToWei(price),
      from: account,
    });
    const receipt = await res.wait();
    onSuccess();
    dispatch(nftPurchased(tokenId));
    dispatch(remove_From_Cart(tokenId));
    console.log(receipt);
  } catch (error) {
    onError(error.message);
  }
};
