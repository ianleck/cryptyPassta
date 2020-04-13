import 'package:flutter/material.dart';
import 'package:mobile/Models/passport_model.dart';

class PassportScreen extends StatefulWidget {
  final Passport _passportObject;
  PassportScreen(this._passportObject);

  @override
  PassportState createState() => PassportState(_passportObject);
}

class PassportState extends State<PassportScreen> {
  Passport _passportObject;

  PassportState(this._passportObject);

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
