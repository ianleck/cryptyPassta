pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

contract Passport is ERC721Full, ERC721Mintable {

    address internal _owner;

    struct Country {
        bool isVerifiedCountry;
        string countryCode;
    }

    enum Action {Enter, Exit}

    struct TravelAction {
        address destination;
        Action action;
        uint256 datetime;
    }

    struct PassportToken {
        bool isActive;
        mapping(uint256 => TravelAction[]) travelRecord;
        uint256 travelRecordLength;
        address issuingCountry;
    }

    mapping(address => Country) internal countryList;

    //Eg; SG123 to index 1 of passportTokenList
    mapping(string => uint256) internal passportUUIDMapping;

    PassportToken[] internal passportTokenList;

    constructor() ERC721Full("Passport", "PASS") public {
        _owner = msg.sender;
    }

    function createPassport(string memory UUID) public onlyVerifiedCountry() {
        require(passportUUIDMapping[UUID] != 0, "[ERROR] A passport with this UUID has already been created");

        PassportToken memory _newPassport;
        _newPassport.isActive = true;
        _newPassport.travelRecordLength = 0;
        _newPassport.issuingCountry = msg.sender;

        uint256 _passportId = passportTokenList.push(_newPassport);
        passportUUIDMapping[UUID] = _passportId;
        _mint(msg.sender, _passportId);
        // consider emitting here
    }

    function freezePassport(string memory UUID) public onlyIssuingCountry(UUID) {
        require(passportTokenList[passportUUIDMapping[UUID] - 1].isActive == true, "[ERROR] The passport with this UUID must be active");
        passportTokenList[passportUUIDMapping[UUID] - 1].isActive = false;
    }

    
    function addNewVerifiedCountry(address country, string memory countryCode) public onlyOwner() {
        countryList[country] = Country(
            true,
            countryCode
        );
    }
    
    function addTravelHistory(string memory UUID, Action action, uint256 timestamp) public onlyOwnerCountry(UUID) {
        
    }

    // function viewTravelHistory(string memory UUID) public view onlyOwnerCountry(UUID) returns(TravelAction[] memory) {

    // }
    function viewVerifiedCountry(address countryAddress) public view returns (string memory) {
        return countryList[countryAddress].countryCode;
    }
    

    //access modifier functions
    modifier onlyOwner() {
        require(msg.sender == _owner, "[INVALID PERMISSION] Owner Required");
        _;
    }

    modifier onlyVerifiedCountry() {
        require(
            countryList[msg.sender].isVerifiedCountry,
            "[INVALID PERMISSION] Verified Country Required"
        );
        _;
    }

    modifier onlyApproved(string memory UUID) {
        require(
            getApproved(passportUUIDMapping[UUID]) == msg.sender,
            "[INVALID PERMISSION] Approved Sender Required"
        );
        _;
    }

    modifier onlyIssuingCountry(string memory UUID) {
        require(
            passportTokenList[passportUUIDMapping[UUID]].issuingCountry ==
                msg.sender,
            "[INVALID PERMISSION] Passport Token Issuing Country Required"
        );
        _;
    }

    modifier onlyOwnerCountry(string memory UUID) {
        require(
            ownerOf(passportUUIDMapping[UUID]) == msg.sender,
            "[INVALID PERMISSION] Passport Token Owner Required"
        );
        _;
    }

}