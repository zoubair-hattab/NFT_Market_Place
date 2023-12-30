import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Hero from '../components/hero/Hero.jsx';
import Card from '../components/card/Card.jsx';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
const HomePage = () => {
  const allUnsoldNFT = useSelector((state) => state.marketReducer.unsoldNFT);
  const [unSoldNFT, setUnsoldNFT] = useState([]);
  const params = useSearchParams()[0].get('type');
  console.log(params);
  useEffect(() => {
    if (params === 'All' || params == null) {
      setUnsoldNFT(allUnsoldNFT);
    } else {
      const nft = allUnsoldNFT?.filter((item) => item?.type === params);
      setUnsoldNFT(nft);
    }
  }, [allUnsoldNFT, params]);
  return (
    <div className="text-red-500">
      <NavBar activer={1} />
      <Hero />
      <Footer />
      <div className="container mb-[75px] gap-3 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {unSoldNFT?.map((item, index) => (
          <Card data={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
