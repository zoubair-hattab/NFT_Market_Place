import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assests/logo.png';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet } from '../../helper/helper';
import { RxAvatar } from 'react-icons/rx';
import { CiWallet } from 'react-icons/ci';
import { FaCrown } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import { IoCreateOutline } from 'react-icons/io5';
import { walletAddressLoaded } from '../../redux/actions/web3Action';
import { FaShoppingBag } from 'react-icons/fa';
import { remove_From_Cart } from '../../redux/actions/cartAction';
import { toast } from 'react-toastify';
import { buyNFT } from '../../redux/interaction';
const NavBar = () => {
  const links = [
    { id: 1, title: 'Home', url: '/' },
    { id: 2, title: 'About', url: '/about' },
    { id: 3, title: 'Services', url: '/services' },
    { id: 4, title: 'Contact', url: '/contract' },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const account = useSelector((state) => state.web3Reducer.account);
  const { connection } = useSelector((state) => state.web3Reducer);
  const { cart } = useSelector((state) => state.cartReducer);
  const [menu, setMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const navigate = useNavigate();
  const connect = async () => {
    connectWallet(connection, dispatch);
  };
  const disconntect = async () => {
    dispatch(walletAddressLoaded(null));
  };

  const marketplaceContract = useSelector(
    (state) => state.marketReducer.contract
  );

  const buyMarketplaceNft = (token, price) => {
    const onSuccess = () => {
      toast.success('woo hoo ! you ow this NFT 🎉');
      navigate('/my_orders');
      window.location.reload();
    };
    const onError = (error) => {
      console.log(error.code);
      toast.error(error);
    };

    buyNFT(
      marketplaceContract,
      account,
      token,
      price,
      dispatch,
      onSuccess,
      onError
    );
  };
  return (
    <>
      <header className="fixed top-0  left-0 w-full py-3 shadow-sm bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="logo" className="w-12" />
          </Link>
          <div className=" hidden md:flex md:space-x-6">
            {links?.map((item) => (
              <Link
                to={item.url}
                key={item.id}
                className="block text-base text-gray-700 hover:text-gray-400 duration-200 transition"
              >
                {item.title}
              </Link>
            ))}
          </div>
          {account?.address ? (
            <div className="relative">
              <div className="flex items-center gap-2">
                <RxAvatar
                  size={45}
                  className="text-gray-600 "
                  onClick={() => setMenu(!menu)}
                />
                <div
                  className="relative"
                  onClick={() => setOpenCart(!openCart)}
                >
                  <FaShoppingBag size={25} className="text-gray-600 " />
                  <span className="text-white absolute -top-2 -right-2 text-sm bg-red-400 w-5 h-5 text-center rounded-full">
                    {cart?.length}
                  </span>
                  {openCart && cart?.length > 0 && (
                    <div className="fixed top-[73px] px-3 py-2 shadow-md right-0 w-[570px] bg-white z-50">
                      {cart?.map((item) => (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 mb-3">
                            <img
                              src={item.image}
                              alt=""
                              className="w-12 h-12 rounded-full"
                            />
                            <p className="text-gray-600">{item.name} </p>
                          </div>
                          <div className="space-x-2">
                            <button
                              className="px-4 py-1 bg-primary text-white rounded-md "
                              onClick={() =>
                                buyMarketplaceNft(item.token, item.price)
                              }
                            >
                              Buy Now
                            </button>
                            <button
                              className="px-4 py-1 bg-red-400 text-white rounded-md"
                              onClick={() =>
                                dispatch(remove_From_Cart(item.token))
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {menu && (
                <div className="absolute top-full right-0  w-[200px] rounded-md bg-gray-200 z-50 p-2 shadow-md">
                  <ul className="space-y-1 text-gray-600 ">
                    <li className="flex items-center gap-1 py-2 px-1 hover:bg-slate-50 cursor-pointer">
                      <CiWallet size={25} className="font-bold" />
                      <span className="text-primary">
                        {account?.address?.slice(0, 10)} ...
                      </span>
                    </li>
                    <li className="flex items-center gap-1 py-2 px-1 hover:bg-slate-50 cursor-pointer">
                      <IoCreateOutline size={25} className="font-bold" />
                      <Link to="/create"> Create NFT</Link>
                    </li>
                    <li className="flex items-center gap-1 py-2 px-1 hover:bg-slate-50 cursor-pointer">
                      <FaCrown size={25} className="font-bold" />
                      <Link to="/my_items">My Items</Link>
                    </li>
                    <li className="flex items-center gap-1 py-2 px-1 hover:bg-slate-50 cursor-pointer">
                      <FaCrown size={25} className="font-bold" />
                      <Link to="/my_orders">My orders</Link>
                    </li>
                    <li
                      className="flex items-center gap-1 hover:bg-slate-50 py-2 px-1 cursor-pointer"
                      onClick={disconntect}
                    >
                      <IoMdLogOut size={25} className="font-bold" />
                      <span>Logout</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button
              className="text-base shadow-md hidden md:block bg-[#2843dc] h-12 px-3 text-white border rounded-md hover:text-[#2843dc] hover:bg-transparent hover:border-[#2843dc] duration-200 transition hover:shadow-sm"
              onClick={() => {
                connect();
              }}
            >
              Connect To Wallet
            </button>
          )}
          {isOpen ? (
            <MdClose
              size={33}
              className="md:hidden text-gray-700"
              onClick={() => {
                setIsOpen(false);
              }}
            />
          ) : (
            <HiOutlineMenuAlt3
              size={33}
              className="md:hidden text-gray-700"
              onClick={() => {
                setIsOpen(true);
              }}
            />
          )}
        </div>
      </header>

      {/* mobile screen */}

      {isOpen && (
        <div className="container z-50 fixed top-[73px] left-0 h-[calc(100%-131px)]   bg-white shadow-md max-w-[330px] w-fill transition duration-300 md:hidden  ">
          {links?.map((item) => (
            <Link
              onClick={() => {
                setIsOpen(false);
              }}
              to={item.url}
              key={item.id}
              className="block text-xl hover:bg-gray-100 first-of-type:mt-2 hover:px-3 last-of-type:mb-2  hover:rounded-md py-2 px-2  text-gray-700 hover:text-gray-400 duration-200 transition"
            >
              {item.title}
            </Link>
          ))}

          <button
            className="text-xl absolute bottom-0 left-0 shadow-md block w-full bg-[#4c4f62] h-12 px-3 text-white border rounded-md hover:text-[#2843dc] hover:bg-transparent hover:border-[#2843dc] duration-200 transition "
            onClick={() => {
              setIsOpen(false) && connect();
            }}
          >
            Connect To Wallet
          </button>
        </div>
      )}
    </>
  );
};

export default NavBar;
