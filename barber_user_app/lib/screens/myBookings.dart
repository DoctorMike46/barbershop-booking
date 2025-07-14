import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '/services/api.dart';
import 'customAppBar.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> {
  List<dynamic> _bookings = [];
  bool _loading = true;
  String? _error;

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

  Future<void> _cancelBooking(String bookingId) async {
    try {
      final success = await Api.cancelBooking(bookingId);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Prenotazione annullata')),
        );
        _fetchBookings();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Errore durante l\'annullamento')),
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
    return Scaffold(
      appBar: const CustomAppBar(title: 'Le mie prenotazioni'),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Colors.white))
          : _error != null
          ? Center(child: Text(_error!, style: const TextStyle(color: Colors.red)))
          : _bookings.isEmpty
          ? const Center(child: Text('Nessuna prenotazione trovata.', style: TextStyle(color: Colors.white)))
          : Padding(
        padding: const EdgeInsets.only(top: 16),
        child: ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: _bookings.length,
          itemBuilder: (_, i) {
            final booking = _bookings[i];
            final service = booking['service'] as Map<String, dynamic>?;
            final timeSlot = booking['timeSlot'] as Map<String, dynamic>?;

            if (service == null || timeSlot == null) {
              return const SizedBox.shrink();
            }

            final dateStr = timeSlot['date'] as String;
            final timeStr = timeSlot['startTime'] as String;
            DateTime? bookingDate;

            try {
              bookingDate = DateTime.parse('${dateStr}T$timeStr');
            } catch (_) {
              bookingDate = null;
            }

            final formattedDate = bookingDate != null
                ? DateFormat('dd/MM/yyyy – HH:mm').format(bookingDate)
                : '$dateStr / ${timeStr.substring(0, 5)}';

            return Card(
              color: Colors.indigo[100],
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 4,
              shadowColor: Colors.white,
              margin: const EdgeInsets.only(bottom: 16),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Servizio: ${service['name'] ?? 'N/A'}',
                      style: const TextStyle(
                        fontFamily: 'Montserrat',
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Data: $formattedDate',
                      style: const TextStyle(
                        fontFamily: 'Montserrat',
                        fontSize: 15,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Stato: ${booking['status'] ?? 'confermato'}',
                      style: const TextStyle(
                        fontFamily: 'Montserrat',
                        fontSize: 15,
                        fontStyle: FontStyle.italic,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Align(
                      alignment: Alignment.centerRight,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.redAccent,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        onPressed: () => _cancelBooking(booking['id'].toString()),
                        child: const Text(
                          'Disdici',
                          style: TextStyle(
                            fontFamily: 'Montserrat',
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
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
    );
  }
}
