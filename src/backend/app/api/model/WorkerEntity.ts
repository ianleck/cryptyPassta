export class WorkerEntity {

    private username: string;
    private hashedPassword: string;
    private salt: string;
    private blockchainAddress: string;

    constructor(username: string, hashedPassword: string, salt: string, blockchainAddress: string) {
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.salt = salt;
        this.blockchainAddress = blockchainAddress;
    }
    
    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.hashedPassword;
    }

    setPassword(hashedPassword: string) {
        this.hashedPassword = hashedPassword;
    }

    getSalt() {
        return this.salt;
    }

    setSalt(salt: string) {
        this.salt = salt;
    }

    getBlockchainAddress() {
        return this.blockchainAddress;
    }
}