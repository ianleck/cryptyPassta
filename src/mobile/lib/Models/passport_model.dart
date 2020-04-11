import 'package:mobile/Models/travelRecord_model.dart';

class Passport {
  String passportUUID;
  String name;
  String dateOfBirth;
  String ic;
  String address;
  List<TravelRecord> travelList;

  Passport(
      {this.passportUUID,
      this.name,
      this.dateOfBirth,
      this.ic,
      this.address,
      this.travelList});

  factory Passport.fromJson(Map<String, dynamic> json) {
    return Passport(
        passportUUID: json['passportUUID'],
        name: json['name'],
        dateOfBirth: json['dateOfBirth'],
        ic: json['ic'],
        address: json['address'],
        travelList: json['travelList']);
  }
}
