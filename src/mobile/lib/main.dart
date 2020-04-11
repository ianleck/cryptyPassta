import 'dart:async';

import 'package:flutter/material.dart';
import 'package:mobile/login.dart';
import 'package:mobile/passport_screen.dart';
import 'package:http/http.dart' as http;

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
    fetchLogin(username, password);
  }

  Future<String> fetchLogin(String username, String password) async {
    var response = await http.get(
        Uri.encodeFull("http://localhost:4000/auth/login?username=" +
            username +
            "&password=" +
            password),
        headers: {"Accept": "application/json"});
    print(response.body);
    setState(() {
      _jwt = response.body;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: _jwt == "" ? Login(_handleLogin) : PassportScreen(_jwt));
  }
}
