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
        const address nationality; //Linked to Country minter
        bool isActive;
    }

    function addNewWorker(string name, address workerAddress) public onlyMinter() {
        Worker memory newWorker = Worker(name, msg.sender, true);
        workers[workerAddress] = newWorker;
    }

    function updateWorkerStatus(address workerAddress, string name, bool status) public onlyMinter() {
        require(workers[workerAddress].nationality == msg.sender, "Cannot update status of worker from another country");
        
        worker[workerAddress].name = name;
        worker[workerAddress].isActive = status;
    }

    //Precondition: Date is in UNIX epoch seconds format
    //PostCondition: Create a transfer Record, Add new travel record to passport
    function travelerDeparture(string UUID, uint256 date, address[] travelList) public onlyWorker(){
        
        address[] travels = travelList;
        TransferRecord memory newTransfer = TransferRecord(msg.sender, travels, true);
        transferAuthority[UUID] = newTransfer;

        passport.addTravelHistory(UUID, Exit, block.timestamp);
    }

    //Precondition: Date is in UNIX epoch seconds format
    //Postcondition: Freeze trasnfer record and add new travel record
    function acceptTraveler(string UUID, uint256 date) public onlyWorker() {


        transferAuthority[UUID].isActive = false;

        passport.addTravelHistory(UUID, Entry, block.timestamp);

    }

    //Precondition: transferRequest must exist
    //PostCondition: Flip locations on transfer request
    function rejectTraveler(string UUID) public onlyWorker() {

        Address toLoc = transferAuthority[UUID].prevOwner;
        transferAuthority[UUID].prevOwner = workers[msg.sender].nationality;
        Address[] newList = [toLoc];
        transferAuthority[UUID].newOwner = newList;

    }


    modifier onlyMinter() {
      require(passport.checkOwner(msg.sender), "[Error] This is a minter only action")
      _;
    }

    modifier onlyWorker() {
        require(workers[msg.sender].isActive == true, "[Error] This is an active worker only action")
        _;
    }

}
