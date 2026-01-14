// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleStorage {
    uint256 private storedValue;
    address public owner;
    string private message;

    event ValueUpdated(uint256 newValue);
    event OwnerSet(address indexed newOwner);
    event MessageUpdated(string newMessage);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnerSet(msg.sender);
    }

    function setValue(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }

    function setMessage(string memory _message) public onlyOwner {
        message = _message;
        emit MessageUpdated(_message);
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}