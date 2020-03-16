pragma solidity ^0.5.0;
import "./Passport.sol";

contract Global {
    address public _globalOwner;
    Passport passport;

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
        bool isActive;
    }


    function addNewCountry() public onlyGlobalOwner() {}

    function addNewWorker(string memory name) public onlyMinter() {
        // string memory nationality = passport.viewMinterCountry(msg.sender);
        // Worker memory newWorker = Worker(name, nationality, true);
    }

    function updateWorkerStatus(address workerAddress, string memory name, bool status) public onlyMinter() {
        // require(passport.viewMinterCountry(msg.sender) == worker[workerAddress].nationality, "Cannot update status of worker from another country");
        worker[workerAddress].name = name;
        worker[workerAddress].isActive = status;
    }

    function acceptTraveler(string memory UUID, uint256 date) public onlyWorker() {
    //    passport.addTravelHistory(worker[msg.sender].nationality, "Enter", date);
       transferAuthority[UUID].isPending = false;
    }


    function rejectTraveler(string memory UUID) public onlyWorker() {
        
    }

    function retrievePassportDetails(string memory UUID) public onlyWorker() {


    }

    modifier onlyMinter() {
        require(true);
        _;
    }

    modifier onlyWorker() {
        require(true);
        _;
    }

    modifier onlyGlobalOwner() {
        require(
            msg.sender == _globalOwner,
            "You do not have the authority to perform this action"
        );
        _;
    }
}