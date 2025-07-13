// lib/screens/auth/login.dart
import 'package:barber_user_app/screens/auth/register.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api.dart';
import '../../routes.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  String _email = '', _password = '';
  bool _loading = false, _error = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();
    setState(() {
      _loading = true;
      _error = false;
    });

    final token = await Api.login(_email, _password);
    if (token != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, Routes.dashboard);
    } else {
      setState(() {
        _error = true;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    const textStyle = TextStyle(
      fontFamily: 'Montserrat',
      color: Colors.black,
      fontWeight: FontWeight.bold,
    );
    final inputBorder = OutlineInputBorder(
      borderSide: const BorderSide(color: Colors.black),
      borderRadius: BorderRadius.circular(8),
    );

    return Scaffold(
      body: Center(
        child: Card(
          color: Colors.white70,
          shadowColor: Colors.white70,
          elevation: 4,
          margin: const EdgeInsets.symmetric(horizontal: 24),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Accedi',
                    style: textStyle.copyWith(fontSize: 24),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  if (_error)
                    Text(
                      'Credenziali non valide',
                      style: textStyle.copyWith(color: Colors.redAccent),
                      textAlign: TextAlign.center,
                    ),
                  const SizedBox(height: 8),
                  TextFormField(
                    style: textStyle,
                    cursorColor: Colors.black,
                    decoration: InputDecoration(
                      labelText: 'Email',
                      labelStyle: textStyle,
                      enabledBorder: inputBorder,
                      focusedBorder: inputBorder,
                    ),
                    keyboardType: TextInputType.emailAddress,
                    validator: (v) => v!.contains('@') ? null : 'Email non valida',
                    onSaved: (v) => _email = v!.trim(),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    style: textStyle,
                    cursorColor: Colors.black,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      labelStyle: textStyle,
                      enabledBorder: inputBorder,
                      focusedBorder: inputBorder,
                    ),
                    obscureText: true,
                    validator: (v) => v!.length >= 6 ? null : 'Minimo 6 caratteri',
                    onSaved: (v) => _password = v!.trim(),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        foregroundColor: Colors.white,
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      onPressed: _loading ? null : _submit,
                      child: _loading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text(
                        'Login',
                        style: TextStyle(
                          fontFamily: 'Montserrat',
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextButton(
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.black,
                      textStyle: const TextStyle(
                        fontFamily: 'Montserrat',
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    onPressed: () {
                      Navigator.of(context).push(PageRouteBuilder(
                        pageBuilder: (_, __, ___) => const RegisterScreen(),
                        transitionsBuilder: (_, animation, __, child) {
                          final slide = Tween<Offset>(
                            begin: const Offset(1, 0),
                            end: Offset.zero,
                          ).chain(CurveTween(curve: Curves.easeInOut))
                              .animate(animation);
                          final fade = Tween<double>(begin: 0, end: 1).animate(animation);
                          return SlideTransition(
                            position: slide,
                            child: FadeTransition(opacity: fade, child: child),
                          );
                        },
                      ));
                    },
                    child: const Text('Non hai un account? Registrati'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
