// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EventTicketing is ERC721 {
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;

    struct Occasion {
        uint256 id;
        string name;
        string picture;
        string description;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
        address organizer;
        uint256 balance;
    }

    mapping(uint256 => Occasion) public occasions;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) public seatsTaken;
    mapping(uint256 => uint256) public eventTicketPrices; // New mapping for event ticket prices


    modifier onlyOrganizer(uint256 _id) {
        require(msg.sender == occasions[_id].organizer, "Only organizer can execute this");
        _;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function createEvent(
        string memory _name,
        string memory _picture,
        string memory _description,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public {
        totalOccasions++;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _picture,
            _description,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location,
            msg.sender,
            0
        );
        eventTicketPrices[totalOccasions] = _cost;
    }

    function mint(uint256 _id, uint256 _seat) public payable {
        // Validate event ID
        require(_id != 0 && _id <= totalOccasions, "Invalid occasion ID");

        // Validate payment amount
        require(msg.value >= occasions[_id].cost, "Insufficient ETH sent");

        // Validate seat availability
        require(seatTaken[_id][_seat] == address(0), "Seat already taken");
        require(_seat <= occasions[_id].maxTickets, "Invalid seat number");

        // Update ticket count, seat assignments, and event balance
        occasions[_id].tickets -= 1;
        hasBought[_id][msg.sender] = true;
        seatTaken[_id][_seat] = msg.sender;
        seatsTaken[_id].push(_seat);

        // Increase the event's balance by the amount of ETH sent
        occasions[_id].balance += msg.value;

        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function getTicketPrice(uint256 _id) public view returns (uint256) {
        return eventTicketPrices[_id]; // Return the ticket price for the given event ID
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function updateEventDetails(
        uint256 _id,
        string memory _name,
        string memory _picture,
        string memory _description,
        uint256 _cost,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOrganizer(_id) {
        Occasion storage occasion = occasions[_id];
        occasion.name = _name;
        occasion.picture = _picture;
        occasion.description = _description;
        occasion.cost = _cost;
        occasion.date = _date;
        occasion.time = _time;
        occasion.location = _location;
    }

    function withdraw(uint256 _id) public onlyOrganizer(_id) {
        uint256 balance = occasions[_id].balance;
        require(balance > 0, "No funds to withdraw");

        // Reset the event's balance before transferring
        occasions[_id].balance = 0;

        // Transfer the funds to the organizer
        (bool success, ) = occasions[_id].organizer.call{value: balance}("");
        require(success, "Withdrawal failed");
    }

}
