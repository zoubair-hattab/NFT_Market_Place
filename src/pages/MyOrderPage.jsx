/* eslint-disable react-hooks/exhaustive-deps */

import NavBar from '../components/layout/NavBar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Card from '../components/card/Card.jsx';
import Lottie from 'react-lottie-player';
import animation from '../assests/waiting.json';
import { useSelector } from 'react-redux';
const MyItemPage = () => {
  const ownNFT = useSelector((state) => state.marketReducer.ownedNFT);

  //const params = useSearchParams()[0].get('type');

  return (
    <div className="text-red-500">
      <NavBar activer={1} />

      <div>
        {!ownNFT || ownNFT.length === 0 ? (
          <div className="flex items-center justify-center w-full h-screen">
            <Lottie
              loop
              animationData={animation}
              play
              speed={0.8}
              style={{ width: 300, height: 300 }}
            />
          </div>
        ) : (
          <div className="container mt-[100px] mb-[75px] gap-3 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ownNFT?.map((item, index) => (
              <Card data={item} key={index} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyItemPage;
