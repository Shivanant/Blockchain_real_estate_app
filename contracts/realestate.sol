// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RealEstate is ERC721URIStorage{

    uint public tokenCount;
    constructor()ERC721("RealEstate","RE"){}

    function mint(string memory tokenURI) public returns(uint){
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, tokenURI);
        return (tokenCount);
    }
    
}