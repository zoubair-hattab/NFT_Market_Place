//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTToken is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("NFT MarketPlace", "MKR") {}

    /**
     * @notice "This function is for creating a new NFT (Non-Fungible Token).
     * @param uri The URL of the metadata is stored on IPFS.
     * @param marketPlaceAddress The address of the marketplace
     * @param creator The address of the owner interacting with this function.
     * @return Identifier for each new token that has been created..
     */

    function safeMint(
        string memory uri,
        address marketPlaceAddress,
        address creator
    ) public payable returns (uint) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _mint(creator, tokenId);
        _setTokenURI(tokenId, uri);
        _setApprovalForAll(creator, marketPlaceAddress, true);
        return tokenId;
    }
}
