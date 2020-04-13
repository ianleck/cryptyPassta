export class PassportEntity {
  private passportUUID: string;
  private name: string;
  private dateOfBirth: string;
  private ic: string;
  private address: string;

  constructor(
    passportUUID: string,
    name: string,
    dateOfBirth: string,
    ic: string,
    address: string
  ) {
    this.passportUUID = passportUUID;
    this.name = name;
    this.dateOfBirth = dateOfBirth;
    this.ic = ic;
    this.address = address;
  }

  getPassportUUID(): string {
    return this.passportUUID;
  }
  setPassportUUID(passportUUID: string) {
    this.passportUUID = passportUUID;
  }
  getName(): string {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
  }
  getDateOfBirth(): string {
    return this.dateOfBirth;
  }
  setDateOfBirth(dateOfBirth: string) {
    this.dateOfBirth = dateOfBirth;
  }
  getIc(): string {
    return this.ic;
  }
  setIc(ic: string) {
    this.ic = ic;
  }
  getAddress(): string {
    return this.address;
  }
  setAddress(address: string) {
    this.address = address;
  }
}
