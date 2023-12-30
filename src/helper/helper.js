import { toast } from 'react-toastify';
import { loadAccount } from '../redux/interaction';
import { ethers } from 'ethers';

export const weiToEther = (num) => {
  return ethers.formatEther(num);
};

export const etherToWei = (n) => {
  const weiBigNumber = ethers.parseEther(n.toString());
  const wei = weiBigNumber.toString();
  return wei;
};

export const connectWallet = async (connection, dispatch) => {
  if (typeof window?.ethereum !== 'undefined') {
    window?.ethereum
      ?.request({ method: 'eth_requestAccounts' })
      .then(async (res) => {
        await loadAccount(connection, dispatch);
      })
      .catch((error) => {
        alert(error.message);
      });
  } else {
    toast.error(
      'Non-Ethereum browser detected. You should consider trying MetaMask!'
    );
  }
};

export const chainOrAccountChangedHandler = () => {
  // reload the page to avoid any errors with chain or account change.
  window.location.reload();
};
