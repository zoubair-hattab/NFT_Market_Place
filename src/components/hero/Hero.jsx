import React, { useState } from 'react';
import banner from '../../assests/hero_bg.jpg';
import { Link, useSearchParams } from 'react-router-dom';
const Hero = () => {
  const [active, setActive] = useState(1);
  const categories = [
    { name: 'All' },
    { name: 'Sport' },
    { name: 'Music' },
    { name: 'Art' },
  ];
  const params = useSearchParams()[0].get('type');
  return (
    <>
      <div
        className={` mt-[73px] min-h-[34vh] md:min-h-[39vh] w-full bg-no-repeat bg-center `}
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        <div className={` container py-12`}>
          <h1
            className={`text-[30px] leading-[1.6] md:text-[40px] text-white font-[600] capitalize`}
          >
            Best Collection for <br /> NFT
          </h1>
          <p className="pt-5 text-[16px] font-[Poppins] leading-[1.8] font-[400] text-white">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
            assumenda? Quisquam itaque <br /> exercitationem labore vel, dolore
            quidem asperiores, laudantium temporibus soluta optio consequatur
            <br /> aliquam deserunt officia. Dolorum saepe nulla provident.
          </p>
        </div>
      </div>
      <div className="container py-3 flex items-center justify-center">
        <ul className="flex  space-x-4 capitalize  text-gray-800 font-medium text-lg ">
          {categories.map((item, index) => (
            <li
              key={item.name}
              onClick={() => setActive(index + 1)}
              className={`py-2 rounded-md px-2 ${
                params === item.name
                  ? 'bg-primary text-white'
                  : params == null &&
                    index + 1 === active &&
                    'bg-primary text-white'
              }`}
            >
              <Link to={`?type=${item.name}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Hero;
