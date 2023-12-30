import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../redux/actions/cartAction';

const Card = ({ data }) => {
  const dispatch = useDispatch();

  return (
    <div className="shadow-md rounded-md">
      <Link to="/fkcdc/dcd">
        <div className="h-[170px]">
          <img src={data?.image} alt="" className="w-full h-full" />
        </div>
        <div className="pt-2  space-y-2">
          <h3 className="text-primary px-2 capitalize font-medium">
            {data?.name}
          </h3>
          <p className="text-gray-500 px-2">
            {data?.desc?.length > 70
              ? data?.desc.slice(0, 70) + ' ...'
              : data?.desc}
          </p>
          <p className="px-2 text-gray-800 font-medium">
            Price :
            <span className="text-primary font-medium">{data?.price} ETH</span>
          </p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => dispatch(addToCart(data))}
        className=" w-full py-2 mt-1 bg-primary capitalize text-white text-base hover:bg-transparent hover:text-primary hover:border-t hover:border-primary transition duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Card;
