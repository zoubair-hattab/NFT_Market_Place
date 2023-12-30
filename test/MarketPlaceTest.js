const {
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MarketPlace contract', function () {
  let auctionPrice = ethers.parseUnits('10', 'ether');
  let mintingCost = ethers.parseUnits('0.0001', 'ether');
  async function deployTokenFixture() {
    const [address1, address2] = await ethers.getSigners();
    const marketplaceContract = await ethers.deployContract('NFTMarket');
    const nftContract = await ethers.deployContract('NFTToken');
    return { marketplaceContract, nftContract, address1, address2 };
  }

  it('NFT symbol must be MKR', async function () {
    const { nftContract } = await loadFixture(deployTokenFixture);
    expect(await nftContract.symbol()).to.equal('MKR');
  });

  it('NFT name must be equal to NFT MarketPlace', async function () {
    const { nftContract } = await loadFixture(deployTokenFixture);
    expect(await nftContract.name()).to.equal('NFT MarketPlace');
  });

  it(`List NFT in marketplace`, async function () {
    const { marketplaceContract, nftContract, address1 } = await loadFixture(
      deployTokenFixture
    );

    await expect(
      marketplaceContract
        .connect(address1)
        .sellItem('www.myNFT.com', auctionPrice, nftContract.target, 'Soprt', {
          value: mintingCost,
        })
    )
      .to.emit(marketplaceContract, 'Item')
      .withArgs(
        nftContract.target,
        marketplaceContract.target,
        address1.address,
        1,
        auctionPrice,
        'Soprt'
      );
  });
  it('Should fail if listing price less then equal to zero ', async function () {
    const { marketplaceContract, nftContract, address1 } = await loadFixture(
      deployTokenFixture
    );
    await expect(
      marketplaceContract
        .connect(address1)
        .sellItem('www.myNFT.com', 0, nftContract.target, 'Soprt', {
          value: mintingCost,
        })
    ).to.be.revertedWith('Price must be at least 1 wei');
  });

  it('Should fail if minting cost is less then equal to zero', async function () {
    const { marketplaceContract, nftContract, address1 } = await loadFixture(
      deployTokenFixture
    );

    await expect(
      marketplaceContract
        .connect(address1)
        .sellItem('www.myNFT.com', auctionPrice, nftContract.target, 'Sport', {
          value: 0,
        })
    ).to.be.revertedWith('Price must be equal to listing price');
  });

  it(`Buy NFT`, async function () {
    const { marketplaceContract, nftContract, address1, address2 } =
      await loadFixture(deployTokenFixture);
    await marketplaceContract
      .connect(address1)
      .sellItem('www.myNFT.com', auctionPrice, nftContract.target, 'Sport', {
        value: mintingCost,
      });
    await expect(
      marketplaceContract
        .connect(address2)
        .buyItem(1, { value: auctionPrice.toString() })
    )
      .to.emit(marketplaceContract, 'Sold')
      .withArgs(
        nftContract.target,
        address2.address,
        address1.address,
        1,
        auctionPrice
      );
  });

  it(`Cancel NFT`, async function () {
    const { marketplaceContract, nftContract, address1 } = await loadFixture(
      deployTokenFixture
    );
    await marketplaceContract
      .connect(address1)
      .sellItem('www.myNFT.com', auctionPrice, nftContract.target, 'Sport', {
        value: mintingCost,
      });
    const getNft = await marketplaceContract.Items(1);
    await expect(marketplaceContract.connect(address1).cancelSell(1))
      .to.emit(marketplaceContract, 'CancelSell')
      .withArgs(1, getNft.owner);
  });

  it('Should fail if txn amount not equal to NFT price ', async () => {
    const { marketplaceContract, nftContract, address1, address2 } =
      await loadFixture(deployTokenFixture);
    await marketplaceContract
      .connect(address1)
      .sellItem('www.myNFT.com', auctionPrice, nftContract.target, 'Sport', {
        value: mintingCost,
      });

    await expect(
      marketplaceContract.connect(address2).buyItem(1, { value: '1000' })
    ).to.be.revertedWith('Price must be equal to NFT price');
  });

  it('Should fail if someone else cancel the sell ', async () => {
    const { marketplaceContract, nftContract, address1, address2 } =
      await loadFixture(deployTokenFixture);
    await marketplaceContract
      .connect(address1)
      .sellItem('www.myNFT.com', auctionPrice, nftContract.target, 'Sport', {
        value: mintingCost,
      });

    await expect(
      marketplaceContract.connect(address2).cancelSell(1)
    ).to.be.revertedWith('Only owner can cancel listing');
  });

  it('Should fail if someone else check balance our platform', async function () {
    const { marketplaceContract, address2, nftContract } = await loadFixture(
      deployTokenFixture
    );
    await marketplaceContract
      .connect(address2)
      .sellItem('www.myNFT.com', auctionPrice, nftContract.target, 'Sport', {
        value: mintingCost,
      });
    await expect(
      marketplaceContract.connect(address2).getBalance()
    ).to.be.revertedWith("You don't have permission to call this function");
  });

  it('Should fail if someone else try  to withdraw balance', async function () {
    const { marketplaceContract, address2, nftContract } = await loadFixture(
      deployTokenFixture
    );
    await marketplaceContract
      .connect(address2)
      .sellItem('www.myNFT.com', auctionPrice, nftContract.target, 'Sport', {
        value: mintingCost,
      });
    await expect(
      marketplaceContract.connect(address2).withdraw(address2)
    ).to.be.revertedWith("You don't have permission to call this function");
  });
});
