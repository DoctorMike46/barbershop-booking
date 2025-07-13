// lib/screens/auth/homepage.dart
import 'package:flutter/material.dart';
import '/services/api.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';

class HomepageScreen extends StatefulWidget {
  const HomepageScreen({super.key});

  @override
  _HomepageScreenState createState() => _HomepageScreenState();
}

class _HomepageScreenState extends State<HomepageScreen> {
  List<Map<String, dynamic>> _bookings = [];
  List<Map<String, dynamic>> _workingDays = [];
  bool _loading = true;
  String? _error;
  final _storage = const FlutterSecureStorage();

  final DateFormat _dateFormatter = DateFormat('dd-MM-yy');
  final DateFormat _timeFormatter = DateFormat('HH:mm');

  static const Map<String, String> _dayNames = {
    'MONDAY': 'LUNEDI',
    'TUESDAY': 'MARTEDI',
    'WEDNESDAY': 'MERCOLEDI',
    'THURSDAY': 'GIOVEDI',
    'FRIDAY': 'VENERDI',
    'SATURDAY': 'SABATO',
    'SUNDAY': 'DOMENICA',
  };

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final bookings = await Api.getBookings();
      final workingDays = await Api.getWorkingDays();

      if (bookings != null && workingDays != null) {
        setState(() {
          _bookings = bookings;
          _workingDays = workingDays;
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'Dati non disponibili';
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

  String _translateDay(String key) => _dayNames[key.toUpperCase()] ?? key;

  String _formatTime(String ts) {
    // Assume format "HH:mm:ss"
    return ts.substring(0,5);
  }

  String _formatDateTime(Map<String, dynamic>? timeSlot) {
    if (timeSlot == null) return 'N/A';
    try {
      final dateStr = timeSlot['date'] as String;
      final timeStr = timeSlot['startTime'] as String;
      final dt = DateTime.parse('${dateStr}T${timeStr}');
      final dateFormatted = _dateFormatter.format(dt);
      final timeFormatted = _timeFormatter.format(dt);
      return '$dateFormatted / $timeFormatted';
    } catch (_) {
      return '${timeSlot['date'] ?? ''} / ${_formatTime(timeSlot['startTime'] as String)}';
    }
  }

  Future<void> _cancelBooking(String bookingId) async {
    try {
      final success = await Api.cancelBooking(bookingId);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Prenotazione annullata')),
        );
        _fetchData();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Fallita annullamento prenotazione')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Errore: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator(color: Colors.white,));
    if (_error != null) return Center(child: Text(_error!));

    return Column(
      children: [
        // Titolo orario settimanale
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Orario salone',
              style: const TextStyle(
                fontFamily: 'Montserrat',
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        // Slider dei giorni lavorativi
        Padding(
          padding: const EdgeInsets.only(top: 16), // stacca dall'appBar
          child: SizedBox(
            height: 160, // altezza aumentata per evitare overflow
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _workingDays.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, i) {
                final wd = _workingDays[i];
                final closed = (wd['closedAllDay'] == true || wd['closedAllDay'] == 1);
                return Container(
                  width: 180,
                  decoration: BoxDecoration(
                    color: Colors.indigo[100],
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: const [
                      BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0,2)),
                    ],
                  ),
                  padding: const EdgeInsets.all(12),
                  child: SingleChildScrollView( // consente scroll interno se overflow
                    child: closed
                        ? Center(
                      child: Text(
                        _translateDay(wd['dayOfWeek'] as String),
                        style: const TextStyle(
                          fontFamily: 'Montserrat',
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.black,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    )
                        : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _translateDay(wd['dayOfWeek'] as String),
                          style: const TextStyle(
                            color: Colors.black,
                            fontFamily: 'Montserrat',
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),

                        const SizedBox(height: 8),
                        Text(
                          '${wd['morningOpen'] != null ? _formatTime(wd['morningOpen'] as String) : ''}'
                              ' - '
                              '${wd['morningClose'] != null ? _formatTime(wd['morningClose'] as String) : ''}',
                          style: const TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'Montserrat',
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${wd['afternoonOpen'] != null ? _formatTime(wd['afternoonOpen'] as String) : ''}'
                              ' - '
                              '${wd['afternoonClose'] != null ? _formatTime(wd['afternoonClose'] as String) : ''}',
                          style: const TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'Montserrat',
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ),
        // Titolo prenotazioni
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Mie prenotazioni',
              style: const TextStyle(
                fontFamily: 'Montserrat',
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        // Lista prenotazioni
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: _bookings.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final booking = _bookings[index];
              final service = booking['service'] as Map<String, dynamic>?;
              final timeSlot = booking['timeSlot'] as Map<String, dynamic>?;
              return Card(
                color: Colors.white70,
                elevation: 4,
                shadowColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Servizio: ${service?['name'] ?? 'N/A'}',
                        style: const TextStyle(
                          fontFamily: 'Montserrat',
                          color: Colors.black,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _formatDateTime(timeSlot),
                        style: const TextStyle(
                          fontFamily: 'Montserrat',
                          color: Colors.black,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Align(
                        alignment: Alignment.centerRight,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            elevation: 6,
                            shadowColor: Colors.indigo,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          onPressed: () => _cancelBooking(booking['id'].toString()),
                          child: const Text(
                            'Disdici',
                            style: TextStyle(
                              color: Colors.white,
                              fontFamily: 'Montserrat',
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}