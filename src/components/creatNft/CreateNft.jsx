import React, { useEffect, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { etherToWei } from '../../helper/helper';
import { formatNFTData } from '../../redux/interaction';
import { nftMinted } from '../../redux/actions/nftAction';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie-player';
import animation from '../../assests/waiting.json';
const CreateNft = () => {
  const [image, setImage] = useState(null);
  const [itemData, setItemData] = useState({
    type: 'Sport',
  });
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.web3Reducer.account);
  const nftReducer = useSelector((state) => state.nftReducer.contract);
  const [loading, setLoading] = useState(false);
  const nftMarketplaceReducer = useSelector(
    (state) => state.marketReducer.contract
  );

  const navigate = useNavigate();
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setItemData({
      ...itemData,
      [name]: value,
    });
  };
  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', image);
      const respon = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: ' 840b37c1b53ca87c08f0',
            pinata_secret_api_key:
              '7b9ec6401fac3f416c83136ee701757506f7050fb855696491ef7435773d60e9',
          },
        }
      );

      const data = JSON.stringify({
        name: itemData?.name,
        description: itemData?.description,
        type: itemData?.type,
        image: `https://gateway.pinata.cloud/ipfs/${respon?.data.IpfsHash}`,
      });
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: ' 840b37c1b53ca87c08f0',
            pinata_secret_api_key:
              '7b9ec6401fac3f416c83136ee701757506f7050fb855696491ef7435773d60e9',
          },
        }
      );

      const url = `https://gateway.pinata.cloud/ipfs/${response?.data.IpfsHash}`;
      console.log(url);
      const tx = await nftMarketplaceReducer.sellItem(
        url,
        etherToWei(itemData?.price),
        nftReducer?.target,
        { from: walletAddress?.address, value: etherToWei('0.0001') }
      );
      const receipt = await tx.wait();

      const info = {
        nftContract: receipt?.logs[4]?.args[0],
        owner: receipt?.logs[4]?.args[1],
        creator: receipt?.logs[4]?.args[2],
        token: Number(receipt?.logs[4]?.args[3]),
        price: receipt?.logs[4]?.args[4],
      };
      const formattedData = await formatNFTData(info, nftReducer);
      dispatch(nftMinted(formattedData));
      setLoading(false);
      navigate('/');
      toast.success('NFT minted successfully 🎉');
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <Lottie
            loop
            animationData={animation}
            play
            speed={0.7}
            style={{ width: 300, height: 300 }}
          />
        </div>
      ) : (
        <div className="container flex justify-center">
          <div className=" mt-32 w-full max-w-2xl shadow-md border rounded-md px-4 py-6 border-gray-300">
            <form onSubmit={handleSumbit}>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="name" className="label">
                    Name: <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Your Name...!"
                    id="name"
                    name="name"
                    onChange={handleChangeInput}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="discription" className="label">
                    Description: <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="description"
                    type="text"
                    className="input-box resize-none"
                    placeholder="Your Description...!"
                    id="discription"
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="price" className="label">
                    Price: <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Your Price...!"
                    id="price"
                    name="price"
                    onChange={handleChangeInput}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="price" className="label">
                    Type NFT: <span className="text-primary">*</span>
                  </label>
                  <select
                    className="input-box"
                    name="type"
                    onChange={handleChangeInput}
                  >
                    <option disabled>Choose Type...</option>
                    <option value="Sport">Sport</option>
                    <option value="Art">Art</option>
                    <option value="Music">Music</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <label
                    htmlFor="image"
                    className="label flex items-center gap-2"
                  >
                    Uplod Image: <span className="text-primary">*</span>
                    {!image && (
                      <FaUpload
                        size={25}
                        color="gray"
                        className="text-gray-600"
                      />
                    )}
                  </label>
                  <input
                    type="file"
                    placeholder="Your Name...!"
                    id="image"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />

                  {image && (
                    <img
                      src={URL.createObjectURL(image && image)}
                      alt=""
                      className="w-32 rounded-full"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="text-xl mt-3 shadow-md block w-full bg-[#2843dc] h-12 px-3 text-white border rounded-md hover:text-[#2843dc] hover:bg-transparent hover:border-[#2843dc] duration-200 transition hover:shadow-sm"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateNft;
