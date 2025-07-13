import 'package:barber_user_app/screens/auth/homepage.dart';
import 'package:barber_user_app/screens/products.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher_string.dart';
import '/services/api.dart';
import 'announcements.dart';
import 'booking.dart';
import 'profile.dart';
import 'package:url_launcher/url_launcher.dart';


class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  _DashboardScreen createState() => _DashboardScreen();
}

class _DashboardScreen extends State<DashboardScreen> {
  int _currentIndex = 0;
  bool _showAnnunci = false;
  String? _userName;
  String? _userEmail;
  bool _loading = true;
  String? _error;

  final List<Widget> _pages = [
    const HomepageScreen(),
    const BookingScreen(),
    const ProductsScreen(),
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
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(60),
        child: Container(
          margin: const EdgeInsets.fromLTRB(0, 0, 0, 0),
          decoration: BoxDecoration(
            color: Colors.indigo[300],
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(20),
              bottomRight: Radius.circular(20),
            ),
            boxShadow: const [
              BoxShadow(
                color: Colors.indigo,
                blurRadius: 8,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: SafeArea(
            child: AppBar(
              automaticallyImplyLeading: false,
              backgroundColor: Colors.transparent,
              elevation: 0,
              title: _buildTitle(),
              centerTitle: true,
              actions: [
                IconButton(
                  icon: const Icon(Icons.message, color: Colors.black),
                  onPressed: () => setState(() => _showAnnunci = true),
                ),
                /*IconButton(
                  icon: const Icon(Icons.location_on, color: Colors.black),
                  onPressed: () async {
                    const latitude = 40.4264387;
                    const longitude = 15.1932613;

                    // 1) Prova Apple Maps
                    final appleMapsUrl = 'maps://?q=$latitude,$longitude';

                    try {
                      var launched = await launchUrlString(
                        appleMapsUrl,
                        mode: LaunchMode.externalApplication,
                      );

                      if (!launched) {
                        // 2) Se fallisce, apri Google Maps via browser
                        final webUrl =
                            'https://www.google.com/maps/search/?api=1&query=$latitude,$longitude';
                        launched = await launchUrlString(
                          webUrl,
                          mode: LaunchMode.externalApplication,
                        );
                      }

                      if (!launched) {
                        throw 'cannot launch any maps';
                      }
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Impossibile aprire la mappa')),
                      );
                    }
                  },
                ),*/

              ],
            ),
          ),
        ),
      ),

      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Colors.white,))
          : _error != null
          ? Center(child: Text(_error!))
          : (_showAnnunci
          ? const AnnouncementsScreen()
          : _pages[_currentIndex]),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildTitle() {
    if (_loading) {
      return const Text('Caricamento...');
    } else if (_error != null) {
      return const Text('Dashboard');
    } else {
      return Text('La Barberia di Luca',
      style: TextStyle(
          fontFamily: "Montserrat",
          letterSpacing: 1,
          fontWeight: FontWeight.bold
      )
      );
    }
  }

  Widget _buildBottomNav() {
    final labels = ['HOME', 'PRENOTA', 'PRODOTTI', 'PROFILO'];
    final icons = [
      Icons.home,
      Icons.cut,
      Icons.shopping_bag_outlined,
      Icons.person,
    ];

    return Container(
      decoration: BoxDecoration(
        color: Colors.white70,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
        boxShadow: const [BoxShadow(color: Colors.white70, blurRadius: 8)],
      ),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: List.generate(labels.length, (index) {
            final isActive = !_showAnnunci && index == _currentIndex;
            return GestureDetector(
              onTap: () => setState(() {
                _showAnnunci = false;
                _currentIndex = index;
              }),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      icons[index],
                      color: isActive ? Colors.indigo[400] : Colors.black54,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      labels[index],
                      style: TextStyle(
                        fontSize: 12,
                        fontFamily: "Montserrat",
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                        color: isActive ? Colors.indigo[400] : Colors.black54,
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
