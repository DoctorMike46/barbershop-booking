// lib/screens/auth/register.dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api.dart';
import '../../routes.dart';
import 'login.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  String _name = '',
      _email = '',
      _password = '',
      _telefono = '';
  bool _loading = false, _error = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();
    setState(() {
      _loading = true;
      _error = false;
    });

    final token = await Api.register(
      name: _name,
      email: _email,
      password: _password,
      telefono: _telefono,
    );

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
          shadowColor: Colors.white,
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
                    'Registrati',
                    style: textStyle.copyWith(fontSize: 24),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  if (_error)
                    Text(
                      'Errore durante la registrazione',
                      style: textStyle.copyWith(color: Colors.redAccent),
                      textAlign: TextAlign.center,
                    ),
                  const SizedBox(height: 8),
                  TextFormField(
                    cursorColor: Colors.black,
                    style: textStyle,
                    decoration: InputDecoration(
                      labelText: 'Nome e Cognome',
                      labelStyle: textStyle,
                      enabledBorder: inputBorder,
                      focusedBorder: inputBorder,
                    ),
                    validator: (v) => v!.isNotEmpty ? null : 'Obbligatorio',
                    onSaved: (v) => _name = v!.trim(),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    cursorColor: Colors.black,
                    style: textStyle,
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
                    cursorColor: Colors.black,
                    style: textStyle,
                    decoration: InputDecoration(
                      labelText: 'Telefono',
                      labelStyle: textStyle,
                      enabledBorder: inputBorder,
                      focusedBorder: inputBorder,
                    ),
                    keyboardType: TextInputType.phone,
                    validator: (v) => v!.isNotEmpty ? null : 'Obbligatorio',
                    onSaved: (v) => _telefono = v!.trim(),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    cursorColor: Colors.black,
                    style: textStyle,
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
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      onPressed: _loading ? null : _submit,
                      child: _loading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text(
                        'Registrati',
                        style: TextStyle(
                          fontFamily: 'Montserrat',
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.white,
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
                          pageBuilder: (context, animation, secondaryAnimation) => const LoginScreen(),
                          transitionsBuilder: (context, animation, secondaryAnimation, child) {
                            // Slide from left and fade
                            final slideTween = Tween<Offset>(
                              begin: const Offset(-1, 0),
                              end: Offset.zero,
                            ).chain(CurveTween(curve: Curves.easeInOut));
                            final offsetAnimation = animation.drive(slideTween);
                            final fadeAnimation = animation;
                            return SlideTransition(
                              position: offsetAnimation,
                              child: FadeTransition(opacity: fadeAnimation, child: child),
                            );
                          },
                        ));
                      },
                    child: const Text('Hai già un account? Accedi'),
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
