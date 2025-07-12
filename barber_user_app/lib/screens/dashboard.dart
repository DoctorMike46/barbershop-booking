import 'package:barber_user_app/screens/auth/homepage.dart';
import 'package:flutter/material.dart';
import '/services/api.dart';
import 'announcements.dart';
import 'profile.dart';

// Se ti serve direttamente lo storage, altrimenti no
// import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  _DashboardScreen createState() => _DashboardScreen();
}

class _DashboardScreen extends State<DashboardScreen> {
  int _currentIndex = 0;
  String? _userName;
  String? _userEmail;
  bool _loading = true;
  String? _error;

  final List<Widget> _pages = [
    const HomepageScreen(),
    const AnnouncementsScreen(),
    Center(child: Text('Prenotazioni')),
    Center(child: Text('Prodotti')),
    const ProfileScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    try {
      final profile = await Api.getProfile();
      if (profile != null) {
        setState(() {
          _userName  = profile['name']  as String?;
          _userEmail = profile['email'] as String?;
          _loading   = false;
        });
      } else {
        setState(() {
          _error   = 'Impossibile caricare il profilo';
          _loading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error   = 'Errore: $e';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _buildTitle(),
        centerTitle: true,
        actions: [
          IconButton(icon: const Icon(Icons.notifications), onPressed: () {}),
          IconButton(icon: const Icon(Icons.location_on), onPressed: () {}),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? Center(child: Text(_error!))
          : _pages[_currentIndex],
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildTitle() {
    if (_loading) {
      return const Text('Caricamento...');
    } else if (_error != null) {
      return const Text('Dashboard');
    } else {
      return Text('Benvenuto, ${_userName ?? 'utente'}');
    }
  }

  Widget _buildBottomNav() {
    final labels = ['Home', 'Annunci', 'Prenota', 'Prodotti', 'Profilo'];
    final icons = [
      Icons.home,
      Icons.message,
      Icons.book_online,
      Icons.shopping_bag,
      Icons.person,
    ];

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: List.generate(labels.length, (index) {
            final isActive = index == _currentIndex;
            return GestureDetector(
              onTap: () => setState(() => _currentIndex = index),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      icons[index],
                      color: isActive ? Colors.black : Colors.black54,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      labels[index],
                      style: TextStyle(
                        fontSize: 12,
                        fontFamily: "Montserrat",
                        color: isActive ? Colors.black : Colors.black54,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}
