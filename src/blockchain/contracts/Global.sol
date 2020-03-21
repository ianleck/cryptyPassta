pragma solidity ^0.5.0;
import "./Passport.sol";

contract Global {
    address public _globalOwner = msg.sender;
    Passport passport;

    //Maps address of worker accounts
    mapping(address => Worker) workers;

    //Maps UUID of passports to trasnfer Records
    mapping(string => TransferRecord) transferAuthority;

    struct TransferRecord {
        address prevOwner;
        address[] newOwner;
        bool isPending;
    }

    struct Worker {
        string name;
        address nationality; //Linked to Country minter
        bool isActive;
    }

    function addNewWorker(string memory name, address workerAddress) public onlyMinter() {
        Worker memory newWorker = Worker(name, msg.sender, true);
        workers[workerAddress] = newWorker;
    }

    function updateWorkerStatus(address workerAddress, string memory name, bool status) public onlyMinter() {
        require(workers[workerAddress].nationality == msg.sender, "Cannot update status of worker from another country");
        workers[workerAddress].name = name;
        workers[workerAddress].isActive = status;
    }

    //Precondition: Date is in UNIX epoch seconds format
    //PostCondition: Create a transfer Record, Add new travel record to passport
    function travelerDeparture(string memory UUID, uint256 date, address[] memory travelList) public onlyWorker() {

        address[] memory travels = travelList;
        TransferRecord memory newTransfer = TransferRecord(msg.sender, travels, true);
        transferAuthority[UUID] = newTransfer;

        passport.addTravelHistory(UUID, Passport.Action.Exit, block.timestamp);
    }

    //Precondition: Date is in UNIX epoch seconds format
    //Postcondition: Freeze trasnfer record and add new travel record
    function acceptTraveler(string memory UUID, uint256 date) public onlyWorker() {


        transferAuthority[UUID].isPending = false;

        passport.addTravelHistory(UUID, Passport.Action.Enter, block.timestamp);

    }

    //Precondition: transferRequest must exist
    //PostCondition: Flip locations on transfer request
    function rejectTraveler(string memory UUID) public onlyWorker() {

        address toLoc = transferAuthority[UUID].prevOwner;
        transferAuthority[UUID].prevOwner = workers[msg.sender].nationality;
        // address[] memory newList = ;
        transferAuthority[UUID].newOwner = [toLoc];

    }


    modifier onlyMinter() {
    //   require(passport.checkOwner(msg.sender), "[Error] This is a minter only action");
      require(true, "[Error] This is a minter only action");
      _;
    }

    modifier onlyWorker() {
        require(workers[msg.sender].isActive == true, "[Error] This is an active worker only action");
        _;
    }

}
