import 'package:flutter/material.dart';
import 'package:mobile/login.dart';
import 'package:mobile/passport_screen.dart';

void main() => runApp(MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    ));

class HomePage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return HomePageState();
  }
}

class HomePageState extends State<HomePage> {
  String _jwt = "";

  void _handleLogin(String username, String password) {
    print("Username : " + username);
    print("Password : " + password);
    //TODO : CALL API TO RETRIEVE PASSWORD
    setState(() {
      _jwt = "TEST";
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: _jwt == "" ? Login(_handleLogin) : PassportScreen());
  }
}
