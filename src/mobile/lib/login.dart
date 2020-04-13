import 'package:flutter/material.dart';
import 'package:mobile/Animation/FadeAnimation.dart';

class Login extends StatefulWidget {
  final Function login;
  Login(this.login);

  @override
  LoginState createState() => LoginState(login);
}

class LoginState extends State<Login> {
  final Function login;
  String password = "";
  String username = "";

  LoginState(this.login);

  @override
  Widget build(BuildContext context) {
    return Container(
        width: double.infinity,
        decoration: BoxDecoration(
            gradient: LinearGradient(begin: Alignment.topCenter, colors: [
          const Color(0xFFBFCAFF),
          const Color(0xFFBFCAFF),
          const Color(0xFFBFCAFF)
        ])),
        child: SingleChildScrollView(
            child: ConstrainedBox(
          constraints:
              BoxConstraints(maxHeight: MediaQuery.of(context).size.height),
          child: Column(
            children: <Widget>[
              SizedBox(
                height: 50,
              ),
              Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    // Text("Login",
                    //     style: TextStyle(color: Colors.blueGrey, fontSize: 40)),
                    FadeAnimation(
                        1.2,
                        Text(
                          "Login",
                          style: TextStyle(color: Colors.white, fontSize: 40),
                        )),
                    SizedBox(
                      height: 10,
                    ),
                    // FadeAnimation(1.3, Text("Welcome Back", style: TextStyle(color: Colors.white, fontSize: 18),)),
                  ],
                ),
              ),
              FadeAnimation(
                  1.3,
                  Container(
                      height: 300,
                      decoration: BoxDecoration(
                          image: DecorationImage(
                        image: AssetImage('assets/images/background.png'),
                      )))),
              Expanded(
                  child: Container(
                      decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(60),
                              topRight: Radius.circular(60))),
                      child: Padding(
                          padding: EdgeInsets.all(20),
                          child: Column(children: <Widget>[
                            SizedBox(
                              height: 40,
                            ),
                            FadeAnimation(
                                1.4,
                                Container(
                                    child: Column(
                                  children: <Widget>[
                                    Container(
                                        padding: EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                            border: Border(
                                                bottom: BorderSide(
                                                    color: Colors.grey[200]))),
                                        child: TextField(
                                          onChanged: (value) => setState(() {
                                            username = value;
                                          }),
                                          decoration: InputDecoration(
                                              hintText: "Username",
                                              hintStyle:
                                                  TextStyle(color: Colors.grey),
                                              border: InputBorder.none),
                                        )),
                                  ],
                                ))),
                            FadeAnimation(
                                1.5,
                                Container(
                                    child: Column(
                                  children: <Widget>[
                                    Container(
                                        padding: EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                            border: Border(
                                                bottom: BorderSide(
                                                    color: Colors.grey[200]))),
                                        child: TextField(
                                          onChanged: (value) => setState(() {
                                            password = value;
                                          }),
                                          obscureText: true,
                                          decoration: InputDecoration(
                                              hintText: "Password",
                                              hintStyle:
                                                  TextStyle(color: Colors.grey),
                                              border: InputBorder.none),
                                        )),
                                  ],
                                ))),
                            SizedBox(height: 40),
                            FadeAnimation(
                                1.6,
                                Text("Forgot Password?",
                                    style: TextStyle(color: Colors.grey))),
                            SizedBox(height: 40),
                            GestureDetector(
                                onTap: () => login(username, password),
                                child: FadeAnimation(
                                    1.7,
                                    Container(
                                      height: 50,
                                      margin:
                                          EdgeInsets.symmetric(horizontal: 50),
                                      decoration: BoxDecoration(
                                          borderRadius:
                                              BorderRadius.circular(50),
                                          color: const Color(0xFF6C63FF)),
                                      child: Center(
                                        child: Text(
                                          "Login",
                                          style: TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    )))
                          ]))))
            ],
          ),
        )));
  }
}
