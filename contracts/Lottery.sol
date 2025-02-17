pragma solidity ^0.4.17;

contract Lottery {
    address public  manager;
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
    }

    function addPlayer() public payable   {
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    function getAllPlayer() public view returns (address[]){
        return players;
    }


    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty,now,players));
    }

    function pickWinner() public  onlyManagerCanPickWinner {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }

    modifier onlyManagerCanPickWinner() {
        require(manager == msg.sender);
        _;
    }

}
