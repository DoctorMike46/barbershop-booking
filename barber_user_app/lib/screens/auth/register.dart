// lib/screens/auth/register.dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api.dart';
import '../../routes.dart';

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
  bool _loading = false, _error = false, _emailTaken = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();
    setState(() {
      _loading = true;
      _error = false;
      _emailTaken = false;
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
    return Scaffold(
      body: Center(
        child: Card(
          color: Colors.black87,
          margin: const EdgeInsets.symmetric(horizontal: 24),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('Registrati', style: Theme.of(context).textTheme.headlineMedium),
                  const SizedBox(height: 16),
                  if (_error)
                    const Text('Errore durante la registrazione',
                        style: TextStyle(color: Colors.redAccent)),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Nome e Cognome'),
                    validator: (v) => v!.isNotEmpty ? null : 'Obbligatorio',
                    onSaved: (v) => _name = v!.trim(),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Email'),
                    keyboardType: TextInputType.emailAddress,
                    validator: (v) => v!.contains('@') ? null : 'Email non valida',
                    onSaved: (v) => _email = v!.trim(),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Telefono'),
                    keyboardType: TextInputType.phone,
                    validator: (v) => v!.isNotEmpty ? null : 'Obbligatorio',
                    onSaved: (v) => _telefono = v!.trim(),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Password'),
                    obscureText: true,
                    validator: (v) =>
                    v!.length >= 6 ? null : 'Minimo 6 caratteri',
                    onSaved: (v) => _password = v!.trim(),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _submit,
                      child: _loading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Registrati'),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextButton(
                    onPressed: () =>
                        Navigator.pushReplacementNamed(context, Routes.login),
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
