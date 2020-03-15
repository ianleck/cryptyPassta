pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

contract Passport is ERC721Full, ERC721Mintable {

    //contract owner
    address internal _owner;

    struct Country {
        bool isMinter; 
        string country;
        string iso3166Code;
    }

    enum Action {Enter, Exit}

    struct TravelAction {
        address destination;
        Action action;
        uint256 date;
    }

    struct PassportToken {
        // defaults to false
        bool isCreated;
        // nationality of passport owner
        string nationality;
        // frozen status
        bool frozenStatus;
        //travel record list
        TravelAction[] travelRecord;
        //home country
        address homeCountry;
    }

    //mapping of address of minter country to country
    mapping(address => Country) internal minterCountryAddressMapping;

    //mapping of passport token uuid to passport token array id
    mapping(string => uint256) internal passportTokenIdMapping;

    //array of passport token
    PassportToken[] internal passportTokenList;

    //UUID Prefix with Country code
    function createPassport(string UUID, string nationality) public onlyMinterCountry() {
        require(passportTokenIdMapping[UUID] != 0, "UUID exist")
        require(nationality == minters[msg.sender].country, "Error: Nationality Mismatch")

        PassportToken memory _newPassport = PassportToken(
            true,
            nationality,
            false,
            TravelAction[],
            msg.sender
        );

        uint256 _passportId = passportTokenList.push(_newPassport);
        passportTokenIdMapping[UUID] = _passportId;
        _mint(msg.sender, _passportId);

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
        // bump
    }

    function viewTravelHistory() public view onlyOwnerCountry(UUID) returns(TravelAction[]) {

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