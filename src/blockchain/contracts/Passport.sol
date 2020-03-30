pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";


contract Passport is ERC721Full, ERC721Mintable {
    address internal _owner;

    constructor() public ERC721Full("Passport", "PASS") {
        _owner = msg.sender;
    }

    struct Country {
        bool isVerifiedCountry;
        string countryCode;
    }

    struct TravelAction {
        address destination;
        string movement;
        uint256 datetime;
    }

    struct PassportToken {
        bool isActive;
        uint256 travelRecordLength;
        address issuingCountry;
    }

    mapping(address => Country) internal countryList;

    //Eg; SG123 to index 1 of passportTokenList
    mapping(string => uint256) internal passportUUIDMapping;
    mapping(string => TravelAction[]) travelRecords;
    PassportToken[] internal passportTokenList;

    event countryRegistrationSuccess(string countryCode);
    event passportCreationSuccess(string UUID);
    event travelRecordAdditionSuccess(string UUID);
    event freezePassportSuccess(string UUID);

    function registerCountry(address country, string memory countryCode)
        public
        onlyOwner() // Need to change to admin, so there's list of admin instead of just owner. Refer to WhitelistAdminRole.sol
    {
        countryList[country] = Country(true, countryCode);
        addMinter(country);
        emit countryRegistrationSuccess(countryCode);
    }

    function createPassport(string memory UUID)
        public
        onlyVerifiedCountry(tx.origin)
    {
        require(
            passportUUIDMapping[UUID] == 0,
            "[ERROR] A passport with this UUID has already been created"
        );
        PassportToken memory _newPassport;
        _newPassport.isActive = true;
        _newPassport.travelRecordLength = 0;
        _newPassport.issuingCountry = msg.sender;

        uint256 _passportId = passportTokenList.push(_newPassport);
        passportUUIDMapping[UUID] = _passportId;
        _mint(msg.sender, _passportId);
        emit passportCreationSuccess(UUID);
    }

    function addTravelRecord(
        string memory UUID,
        string memory movement,
        uint256 timestamp
    ) public onlyVerifiedCountry(tx.origin) {
        require(
            passportUUIDMapping[UUID] != 0,
            "[ERROR] No such passport has been created"
        );
        uint256 _passportId = passportUUIDMapping[UUID] - 1;
        PassportToken memory passportToView = passportTokenList[_passportId];
        require(
            passportToView.isActive == true,
            "[ERROR] Passport has been frozen!"
        );
        TravelAction memory _newRecord;
        _newRecord.destination = msg.sender;
        _newRecord.movement = movement;
        _newRecord.datetime = timestamp;

        travelRecords[UUID].push(_newRecord);
        uint256 newTravelRecordLength = passportToView.travelRecordLength + 1;
        passportToView.travelRecordLength = newTravelRecordLength;
        passportTokenList[_passportId] = passportToView;
        emit travelRecordAdditionSuccess(UUID);
    }

    function freezePassport(string memory UUID)
        public
        onlyIssuingCountry(UUID)
    {
        uint256 _passportId = passportUUIDMapping[UUID] - 1;
        PassportToken memory passportToFreeze = passportTokenList[_passportId];
        passportToFreeze.isActive = false;
        passportTokenList[_passportId] = passportToFreeze;
        emit freezePassportSuccess(UUID);
    }

    function viewPassportTravelRecords(string memory UUID)
        public
        view
        returns (TravelAction[] memory)
    {
        require(
            passportUUIDMapping[UUID] != 0,
            "[ERROR] No such passport has been created"
        );
        uint256 _passportId = passportUUIDMapping[UUID] - 1;
        PassportToken memory passportToView = passportTokenList[_passportId];
        require(
            passportToView.isActive == true,
            "[ERROR] Passport has been frozen!"
        );
        return travelRecords[UUID];
    }

    function viewPassport(string memory UUID)
        public
        view
        returns (PassportToken memory)
    {
        require(
            passportUUIDMapping[UUID] != 0,
            "[ERROR] No such passport has been created"
        );
        uint256 _passportId = passportUUIDMapping[UUID] - 1;
        PassportToken memory passportToView = passportTokenList[_passportId];
        return passportToView;
    }

    function viewRegisteredCountry(address countryAddress)
        public
        view
        returns (string memory)
    {
        require(
            countryList[countryAddress].isVerifiedCountry == true,
            "[ERROR] No such country has been registered"
        );
        return countryList[countryAddress].countryCode;
    }

    function checkVerifiedCountry(address countryAddress)
        public
        view
        returns (bool)
    {
        return countryList[countryAddress].isVerifiedCountry;
    }

    //access modifier functions
    modifier onlyOwner() {
        require(msg.sender == _owner, "[INVALID PERMISSION] Owner Required");
        _;
    }

    modifier onlyVerifiedCountry(address sender) {
        require(
            countryList[sender].isVerifiedCountry,
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
            passportTokenList[passportUUIDMapping[UUID] - 1].issuingCountry ==
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
