import 'dart:async';

import 'package:flutter/material.dart';
import 'package:mobile/login.dart';
import 'package:mobile/passport_screen.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/Models/passport_model.dart';
import 'dart:convert';

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
  bool _isLogin = false;
  Passport _passportObject;

  void _handleLogin(String username, String password) {
    print("Username : " + username);
    print("Password : " + password);
    fetchLogin(username, password);
  }

  Future<Passport> fetchLogin(String username, String password) async {
    var response = await http.get(
        Uri.encodeFull("http://localhost:4000/auth/citizenLogin?citizenIC=" +
            username +
            "&dateOfBirth=" +
            password),
        headers: {"Accept": "application/json"});
    print(response.body);
    setState(() {
      _passportObject = Passport.fromJson(json.decode(response.body));
      _isLogin = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: _isLogin ? PassportScreen(_passportObject) : Login(_handleLogin));
  }
}
