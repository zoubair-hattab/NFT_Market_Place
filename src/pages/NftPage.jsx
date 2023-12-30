import React from 'react';
import NavBar from '../components/layout/NavBar';
import CreateNft from '../components/creatNft/CreateNft';
import Footer from '../components/layout/Footer';

const NftPage = () => {
  return (
    <div>
      <NavBar activer={1} />
      <CreateNft />
      <Footer />
    </div>
  );
};

export default NftPage;
