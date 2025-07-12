import 'dart:async';
import 'package:flutter/material.dart';
import '../../routes.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _fadeIn;

  @override
  void initState() {
    super.initState();

    // controller per 1.5s di animazione fade-in
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 4000),
    );

    _fadeIn = CurvedAnimation(parent: _controller, curve: Curves.easeIn);

    // avvia l’animazione
    _controller.forward();

    // dopo 2s naviga alla login
    Timer(const Duration(seconds: 5), () {
      Navigator.of(context).pushReplacementNamed(Routes.login);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,  // sfondo nero barberia
      body: FadeTransition(
        opacity: _fadeIn,
        child: Center(
          child: Image.asset(
            'assets/logo.webp',         // metti qui il tuo logo
            width: 180,
            height: 180,
          ),
        ),
      ),
    );
  }
}
