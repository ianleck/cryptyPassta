import 'package:flutter/material.dart';
import 'package:mobile/Models/passport_model.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PassportScreen extends StatefulWidget {
  final String _jwt;
  PassportScreen(this._jwt);

  @override
  PassportState createState() => PassportState(_jwt);
}

class PassportState extends State<PassportScreen> {
  final String _jwt;
  Passport _passportObject = Passport(
      address: "", name: "", ic: "", passportUUID: "", dateOfBirth: "");

  PassportState(this._jwt);

  void fetchPassport() async {
    var response = await http.get(
        Uri.encodeFull(
            "http://localhost:4000/passport/searchPassport?passportUUID=eb4d2a1c-b8a5-446d-a3c5-9be872369a8b"),
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer " + _jwt
        });

    if (response.statusCode == 200) {
      // If the server did return a 200 OK response,
      // then parse the JSON.
      print(json.decode(response.body));
      setState(() {
        _passportObject = Passport.fromJson(json.decode(response.body));
      });
    } else {
      // If the server did not return a 200 OK response,
      // then throw an exception.
      throw Exception('Failed to load passport');
    }
  }

  // On load
  @override
  void initState() {
    super.initState();
    fetchPassport();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
            gradient: LinearGradient(begin: Alignment.bottomRight, colors: [
          const Color(0xFFBFCAFF),
          const Color(0xFFD9DFFF),
          const Color(0xFFF2F4FF)
        ])),
        child: Column(children: <Widget>[
          Stack(children: <Widget>[
            Container(
                height: MediaQuery.of(context).size.width,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(30.0),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black26,
                        offset: Offset(0.0, 2.0),
                        blurRadius: 6.0,
                      ),
                    ]),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(30.0),
                  child: Image(
                    image: AssetImage('assets/images/passport2.png'),
                    height: MediaQuery.of(context).size.height,
                    width: MediaQuery.of(context).size.width,
                    fit: BoxFit.cover,
                  ),
                )),
          ]),
          Expanded(
              child: Container(
                  child: Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                SizedBox(height: 30),
                Text(
                  'Name',
                  style:
                      TextStyle(color: const Color(0xFF6C63FF), fontSize: 20),
                ),
                SizedBox(height: 10),
                Text(
                  _passportObject.name,
                  style: TextStyle(color: Colors.black, fontSize: 16),
                ),
                SizedBox(height: 15),
                Text(
                  'Passport No',
                  style:
                      TextStyle(color: const Color(0xFF6C63FF), fontSize: 20),
                ),
                SizedBox(height: 10),
                Text(
                  _passportObject.passportUUID,
                  style: TextStyle(color: Colors.black, fontSize: 16),
                ),
                SizedBox(height: 15),
                Text(
                  'Identity Card Number',
                  style:
                      TextStyle(color: const Color(0xFF6C63FF), fontSize: 20),
                ),
                SizedBox(height: 10),
                Text(
                  _passportObject.ic,
                  style: TextStyle(color: Colors.black, fontSize: 16),
                ),
                SizedBox(height: 15),
                Text(
                  'Date of Birth',
                  style:
                      TextStyle(color: const Color(0xFF6C63FF), fontSize: 20),
                ),
                SizedBox(height: 10),
                Text(
                  _passportObject.dateOfBirth,
                  style: TextStyle(color: Colors.black, fontSize: 16),
                ),
                SizedBox(height: 15),
                Text(
                  'Address',
                  style:
                      TextStyle(color: const Color(0xFF6C63FF), fontSize: 20),
                ),
                SizedBox(height: 10),
                Text(
                  _passportObject.address,
                  style: TextStyle(color: Colors.black, fontSize: 16),
                ),
              ],
            ),
          )))
        ]));
  }
}
