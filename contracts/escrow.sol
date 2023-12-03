// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Escrow {
    address payable public  inspector;
    // address payable public seller;
    // address payable public buyer;

    // Define the NFT address
    address public nftAddress;

    struct Item {
        address payable owner;
        uint price;
        bool sold;
        uint itemId;
        address payable moneyaddress;
    }

    mapping(uint => Item) public items;

    constructor(address _nftAddress,address payable _inspector) {
        inspector = _inspector;
        nftAddress = _nftAddress;
    }

    function makeItem(uint _nftId, uint _price) public payable {
        require(_price > 0, "The price should be greater than zero");
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftId);
        items[_nftId] = Item(
            payable(address(this)),
            _price,
            false,
            _nftId,
            inspector
        );
    }

    function purchaseItem(uint _itemId) external payable {
        Item storage item = items[_itemId];
        require(msg.value >= item.price, "The message value should be greater than or equal to the item price");
        require(!item.sold, "The item should be available to purchase");
        IERC721(nftAddress).transferFrom(item.owner, msg.sender, _itemId);

        item.owner =payable(msg.sender);
        item.sold = true;


        // (bool success,) = payable(msg.sender).call{value: address(this).balance}(
        //     ""
        // );
        item.moneyaddress.transfer(item.price);
        item.moneyaddress=payable(msg.sender);


    }

    function sellItem(uint _itemId, uint _price) public {
        Item storage item = items[_itemId];
        // require(!item.sold, "The item should be available to purchase");
        require(msg.sender==item.owner);
        IERC721(nftAddress).transferFrom(item.owner, address(this), _itemId);
        item.owner = payable(address(this));
        item.price = _price; // Update the item's price
        item.sold = false; // Mark the item as available for purchase again
    }

    function balance(address a)public view returns(uint256) {
        return a.balance;

    }
}
