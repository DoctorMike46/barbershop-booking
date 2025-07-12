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
  bool _loading = true;
  String? _error;
  final _storage = const FlutterSecureStorage();

  final DateFormat _dateFormatter = DateFormat('dd-MM-yy');
  final DateFormat _timeFormatter = DateFormat('HH:mm');

  @override
  void initState() {
    super.initState();
    _fetchBookings();
  }

  Future<void> _fetchBookings() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final bookings = await Api.getBookings();
      if (bookings != null) {
        setState(() {
          _bookings = bookings;
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'Nessuna prenotazione trovata';
          _loading = false;
        });
      }
    } catch (e) {
      print('Error fetching bookings: $e');
      setState(() {
        _error = 'Errore: $e';
        _loading = false;
      });
    }
  }

  Future<void> _cancelBooking(String bookingId) async {
    try {
      final success = await Api.cancelBooking(bookingId);
      print('Cancel booking $bookingId: $success');
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Prenotazione annullata')),
        );
        _fetchBookings();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Fallita annullamento prenotazione')),
        );
      }
    } catch (e) {
      print('Error cancelling booking: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Errore: $e')),
      );
    }
  }

  String _formatDateTime(Map<String, dynamic>? timeSlot) {
    if (timeSlot == null) return 'N/A';
    try {
      final dateStr = timeSlot['date'] as String;
      final timeStr = timeSlot['startTime'] as String;
      // Usa interpolazione corretta per parsare
      final dt = DateTime.parse('${dateStr}T${timeStr}');
      final dateFormatted = _dateFormatter.format(dt);
      final timeFormatted = _timeFormatter.format(dt);
      return '$dateFormatted  /  $timeFormatted';
    } catch (e) {
      print('Date parsing error: $e');
      // Fallback: usa substring per tagliare i secondi
      return '${timeSlot['date'] ?? 'N/A'}  ${timeSlot['startTime']?.substring(0,5) ?? 'N/A'}';
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return Center(child: Text(_error!));
    }
    return ListView.separated(
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
                if (booking['barber'] != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Barbiere: ${(booking['barber'] as Map<String, dynamic>)['name']}',
                    style: const TextStyle(
                      fontFamily: 'Montserrat',
                      color: Colors.black,
                      fontSize: 14,
                    ),
                  ),
                ],
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
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
    );
  }
}
