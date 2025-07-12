import 'package:flutter/material.dart';
import '/services/api.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? _profile;
  bool _loading = true;
  String? _error;
  final _storage = const FlutterSecureStorage();

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  Future<void> _fetchProfile() async {
    try {
      final profile = await Api.getProfile();
      if (profile != null) {
        setState(() {
          _profile = profile;
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'Impossibile caricare i dati';
          _loading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Errore: $e';
        _loading = false;
      });
    }
  }

  Future<void> _logout() async {
    await _storage.delete(key: 'jwt');
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return _loading
        ? const Center(child: CircularProgressIndicator())
        : _error != null
        ? Center(child: Text(_error!))
        : Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text('Profilo',
              style: TextStyle(
                fontFamily: "Montserrat",
                fontSize: 30,
                fontWeight: FontWeight.bold,
                letterSpacing: 1
              ),
          ),
          const SizedBox(height: 16),
          Text('Nome: ${_profile!['name']}'),
          Text('Email: ${_profile!['email']}'),
          Text('Telefono: ${_profile!['telefono']}'),
          const Spacer(),
          Center(
            child: ElevatedButton(
              onPressed: _logout,
              child: const Text('Logout',
                style: TextStyle(
                  fontFamily: "Montserrat",
                  fontSize: 20,
                  color: Colors.white
                ),

              ),
            ),
          ),
        ],
      ),
    );
  }
}
