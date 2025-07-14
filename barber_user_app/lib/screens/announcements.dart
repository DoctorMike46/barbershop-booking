import 'package:flutter/material.dart';
import '/services/api.dart';

class AnnouncementsScreen extends StatefulWidget {
  const AnnouncementsScreen({super.key});

  @override
  _AnnouncementsScreen createState() => _AnnouncementsScreen();
}

class _AnnouncementsScreen extends State<AnnouncementsScreen> {
  List<Map<String, dynamic>> _annunci = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchAnnunci();
  }

  Future<void> _fetchAnnunci() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final result = await Api.getAnnouncements();
      if (result != null) {
        setState(() {
          _annunci = result;
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'Nessun annuncio disponibile';
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

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator(color: Colors.white,));
    }
    if (_error != null) {
      return Center(child: Text(_error!));
    }
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _annunci.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final annuncio = _annunci[index];
        return Card(
          color: Colors.indigo[100],
          elevation: 4,
          shadowColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  annuncio['title'] ?? 'Titolo mancante',
                  style: const TextStyle(
                    fontFamily: 'Montserrat',
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  annuncio['content'] ?? 'Contenuto mancante',
                  style: const TextStyle(
                    fontFamily: 'Montserrat',
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.black
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
