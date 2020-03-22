export class WorkerEntity {
  private username: string;
  private password: string;
  private salt: string;
  private blockchainAddress: string;

  constructor(
    username: string,
    hashedPassword: string,
    salt: string,
    blockchainAddress: string
  ) {
    this.username = username;
    this.password = hashedPassword;
    this.salt = salt;
    this.blockchainAddress = blockchainAddress;
  }

  getUsername() {
    return this.username;
  }

  getPassword() {
    return this.password;
  }

  setPassword(password: string) {
    this.password = password;
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
