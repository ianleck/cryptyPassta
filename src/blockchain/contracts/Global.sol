pragma solidity ^0.5.0;
import "./Passport.sol";


contract Global {
    address public _globalOwner = msg.sender;
    Passport passport;

    constructor(Passport passportAddress) public {
        passport = passportAddress;
    }

    //Maps address of worker accounts
    mapping(address => Worker) workers;

    //Maps UUID of passports to trasnfer Records
    mapping(string => TransferRecord) transferAuthority;

    event workerRegistered(string name, address nation, bool isActive);
    //departure and arrival, emits passport UUID and country posting the event
    event departure(string UUID, address country);
    event arrival(string UUID, address country);
    event rejection(string UUID, address country);

    //event debug(bool);

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

    function addNewWorker(string memory name, address workerAddress)
        public
        onlyCountries(msg.sender)
    {
        //bool test = passport.checkVerifiedCountry(msg.sender);
        //emit debug(test);

        Worker memory newWorker = Worker(name, msg.sender, true);
        workers[workerAddress] = newWorker;
        emit workerRegistered(
            newWorker.name,
            newWorker.nationality,
            newWorker.isActive
        );
    }

    function updateWorkerStatus(
        address workerAddress,
        string memory name,
        bool status
    ) public onlyCountries(msg.sender) {
        require(
            workers[workerAddress].nationality == msg.sender,
            "Cannot update status of worker from another country"
        );
        workers[workerAddress].name = name;
        workers[workerAddress].isActive = status;
    }

    //Precondition: Date is in UNIX epoch seconds format
    //PostCondition: Create a transfer Record, Add new travel record to passport
    function travelerDeparture(string memory UUID, address[] memory travelList)
        public
        onlyCountries(msg.sender)
    {
        address[] memory travels = travelList;
        TransferRecord memory newTransfer = TransferRecord(
            msg.sender,
            travels,
            true
        );
        transferAuthority[UUID] = newTransfer;

        passport.addTravelRecord(UUID, "EXIT", block.timestamp);
        emit departure(UUID, msg.sender);
    }

    //Precondition: Date is in UNIX epoch seconds format
    //Postcondition: Freeze trasnfer record and add new travel record
    function acceptTraveler(string memory UUID)
        public
        onlyCountries(msg.sender)
    {
        transferAuthority[UUID].isPending = false;

        passport.addTravelRecord(UUID, "ENTER", block.timestamp);
        emit arrival(UUID, msg.sender);
    }

    //Precondition: transferRequest must exist
    //PostCondition: Flip locations on transfer request
    function rejectTraveler(string memory UUID)
        public
        onlyCountries(msg.sender)
    {
        address toLoc = transferAuthority[UUID].prevOwner;
        transferAuthority[UUID].prevOwner = workers[msg.sender].nationality;
        // address[] memory newList = ;
        transferAuthority[UUID].newOwner = [toLoc];

        emit rejection(UUID, msg.sender);
    }

    function checkActiveWorker(address workeraddress)
        public
        view
        onlyCountries(msg.sender)
        returns (bool)
    {
        return workers[workeraddress].isActive;
    }

    function checkActiveTransfer(string memory UUID)
        public
        view
        onlyCountries(msg.sender)
        returns (bool)
    {
        return transferAuthority[UUID].isPending;
    }

    function checkVerifiedCountry(address sender) internal view returns (bool) {
        string memory result = passport.viewRegisteredCountry(sender);
        return
            keccak256(abi.encodePacked((result))) !=
            keccak256(abi.encodePacked(("")));
    }

    modifier onlyCountries(address sender) {
        //   require(passport.checkOwner(msg.sender), "[Error] This is a minter only action");
        require(checkVerifiedCountry(sender) == true, "Fail");
        _;
    }

    modifier onlyWorker() {
        require(
            workers[msg.sender].isActive == true,
            "[Error] This is an active worker only action"
        );
        _;
    }

    modifier onlyOwner() {
        require(
            msg.sender == _globalOwner,
            "[Error] This is platform owner action"
        );
        _;
    }
}
