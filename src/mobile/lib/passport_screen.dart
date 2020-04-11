import 'package:flutter/material.dart';

class PassportScreen extends StatefulWidget {
  @override
  PassportState createState() => PassportState();
}

class PassportState extends State<PassportScreen> {
  // On load
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(children: <Widget>[
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
          child: Image(
            image: AssetImage('assets/images/passport.jpg'),
            fit: BoxFit.fill,
          ),
        )
      ])
    ]);
  }
}
