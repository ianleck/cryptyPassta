pragma solidity ^0.5.0;
import "./Passport.sol";

contract Global {
    address public _globalOwner;
    Passport passport;
    enum jobscope {customs_officer, others}

    mapping(address => Worker) worker;
    mapping(string => TransferRecords) transferAuthority;

    struct TransferRecords {
        address prevOwner;
        address[] newOwner;
        bool isPending;
    }

    struct Worker {
        string name;
        string nationality;
        bool status;
        jobscope role;
    }


    function addNewCountry() public onlyGlobalOwner() {}

    function addNewWorker(string name, jobscope role) public onlyMinter() {
        string nationality = passport.viewMinterCountry(msg.sender);
        Worker memory newWorker = Worker(name, nationality, jobscope.customs_officer, role);
    }

    function updateWorkerStatus(string name, bool status) public onlyMinter() {
            
    }

    function acceptTraveler(string UUID) public onlyWorker() {
       passport.addTravelHistory(UUID);
       passport.getPassport
 
    }

    uint256 _passportId = passportTokenList.push(_newPassport);
    passportTokenIdMapping[UUID] = _passportId;
    _mint(msg.sender, _passportId);


    function rejectTraveler(string UUID) public onlyWorker() {}

    function retrievePassportDetails(string UUID) public onlyWorker() {}

    modifier onlyMinter() {
      require()
    }

    modifier onlyWorker() {}

    modifier onlyGlobalOwner() {
        require(
            msg.sender == _globalOwner,
            "You do not have the authority to perform this action"
        );
    }
}
    function rejectTraveler() public onlyWorker() {}

    function retrievePassportDetails() public onlyWorker() {}

    modifier onlyMinter() {
      require()
    }

    modifier onlyWorker() {}

    modifier onlyGlobalOwner() {
        require(
            msg.sender == _globalOwner,
            "You do not have the authority to perform this action"
        );
    }
}
