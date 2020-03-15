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
        TravelAction[] travelRecord;
        address issuingCountry;
    }

    mapping(address => Country) internal countryList;

    //Eg; SG123 to index 1 of passportTokenList
    mapping(string => uint256) internal passportUUIDMapping;

    PassportToken[] internal passportTokenList;

    function createPassport(string memory UUID) public onlyMinterCountry() {
        require(passportUUIDMapping[UUID] != 0, "[ERROR] A passport with this UUID has already been created");

        PassportToken memory _newPassport = PassportToken(
            true,
            TravelAction[],
            msg.sender
        );

        uint256 _passportId = passportTokenList.push(_newPassport);
        passportUUIDMapping[UUID] = _passportId;
        _mint(msg.sender, _passportId);
        // consider emitting here
    }

    function freezePassport(string UUID) public onlyHomeCountry(UUID) {
        passportTokenList[UUID].frozenStatus = true;
    }

    
    function addNewMinterCountry(string uuid, address country, string countryName, string countryCode) public onlyOwner() {
        Country memory newCountry = Country(
            true,
            countryName,
            countryCode
        );
    }
    
    function addTravelHistory(string UUID) public onlyOwnerCountry(UUID) {
        
    }

    function viewTravelHistory() public view onlyOwnerCountry(UUID) returns(TravelAction[]) {

    }

    function _mint() {

    }

    function viewMinterCountry(Address address) public view returns string {
        Country targetedCountry = minterCountryAddressMapping(address);
        return targetedCountry.country;
    }
    

    //access modifier functions
    modifier onlyOwner() {
        require(msg.sender == _owner, "[INVALID PERMISSION] Owner Required");
        _;
    }

    modifier onlyMinterCountry() {
        require(
            minterCountryAddressMapping[msg.sender].isMinter,
            "[INVALID PERMISSION] Minter Country Required"
        );
        _;
    }

    modifier onlyApproved(string UUID) {
        require(
            getApproved(passportTokenIdMapping[UUID]) == msg.sender,
            "[INVALID PERMISSION] Approved Sender Required"
        );
        _;
    }

    modifier onlyHomeCountry(string UUID) {
        require(
            passportTokenList[passportTokenIdMapping[UUID]].homeCountry ==
                msg.sender,
            "[INVALID PERMISSION] Passport Token Home Country Required"
        );
        _;
    }

    modifier onlyOwnerCountry(string UUID) {
        require(
            ownerOf(passportTokenIdMapping[UUID]) == msg.sender,
            "[INVALID PERMISSION] Passport Token Owner Required"
        );
        _;
    }

}