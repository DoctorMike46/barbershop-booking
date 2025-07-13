import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:intl/date_symbol_data_local.dart';
import '../routes.dart';
import '/services/api.dart';

class BookingScreen extends StatefulWidget {
  const BookingScreen({super.key});

  @override
  _BookingScreenState createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  int _step = 0;

  List<Map<String, dynamic>> _services = [];
  Map<String, dynamic>? _selectedService;
  List<String> _availableDays = [];
  String? _selectedDay;
  List<Map<String, dynamic>> _timeSlots = [];
  Map<String, dynamic>? _selectedTimeSlot;

  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    initializeDateFormatting('it_IT', null).then((_) {
      _loadServices();
    });
  }

  String _formatTime(String ts) {
    try {
      return ts.substring(0, 5);
    } catch (_) {
      return ts;
    }
  }

  Future<void> _loadServices() async {
    setState(() => _loading = true);
    try {
      final list = await Api.getServices();
      setState(() {
        _services = list ?? [];
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Errore caricando servizi';
        _loading = false;
      });
    }
  }

  Future<void> _selectService(Map<String, dynamic> service) async {
    setState(() {
      _selectedService = service;
      _step = 1;
      _loading = true;
      _error = null;
    });
    try {
      final days = await Api.getAvailableDays();
      setState(() {
        _availableDays = days ?? [];
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Errore caricando giorni';
        _loading = false;
      });
    }
  }

  Future<void> _selectDay(String dateStr) async {
    setState(() {
      _selectedDay = dateStr;
      _step = 2;
      _loading = true;
      _error = null;
    });
    try {
      final ts = await Api.getTimeSlots(dateStr,_selectedService!['duration']);
      setState(() {
        _timeSlots = ts ?? [];
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Errore caricando orari';
        _loading = false;
      });
    }
  }

  Future<void> _book() async {
    if (_selectedTimeSlot == null) return;
    setState(() => _loading = true);
    try {
      final response = await Api.createBooking(
        serviceId: _selectedService!['id'] as int,
        timeSlotId: _selectedTimeSlot!['id'] as int,
      );
      if (response != null) {
        Navigator.pushReplacementNamed(context, Routes.dashboard);
      } else {
        setState(() {
          _error = 'Prenotazione non riuscita';
          _loading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Errore durante la prenotazione';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator(color: Colors.white,));
    if (_error != null) return Center(child: Text(_error!));

    switch (_step) {
      case 0:
        return _buildServicesStep();
      case 1:
        return _buildDaysStep();
      case 2:
        return _buildTimeSlotsStep();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildServicesStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            'Servizi disponibili',
            style: TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _services.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (_, i) {
              final svc = _services[i];
              return Card(
                color: Colors.white70,
                shadowColor: Colors.white,
                elevation: 4,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  title: Text(
                    svc['name'],
                    style: const TextStyle(
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  subtitle: Text(
                    '€${svc['price']}',
                    style: const TextStyle(
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  trailing: const Icon(Icons.arrow_forward, color: Colors.black),
                  onTap: () => _selectService(svc),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDaysStep() {
    if (_availableDays.isEmpty) {
      return const Center(child: Text('Nessuna data disponibile'));
    }
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 30, 16, 8),
          child: Text(
            'Giorni disponibili',
            style: TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: 30),
          child: SizedBox(
            height: 140,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _availableDays.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, i) {
                final dateStr = _availableDays[i];
                final dt = DateTime.parse(dateStr);
                final weekday = DateFormat.EEEE('it_IT').format(dt);
                final day = DateFormat.d().format(dt);
                final isSelected = dateStr == _selectedDay;
                return GestureDetector(
                  onTap: () => _selectDay(dateStr),
                  child: Card(
                    shadowColor: Colors.white,
                    color: isSelected ? Colors.indigo[100] : Colors.white70,
                    elevation: isSelected ? 6 : 4,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    child: SizedBox(
                      width: 100,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            weekday,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: Colors.black,
                              fontFamily: 'Montserrat',
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            day,
                            style: const TextStyle(
                              fontFamily: 'Montserrat',
                              color: Colors.indigo,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ),
        Align(
          alignment: Alignment.centerLeft,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 0, 0),
            child: TextButton(
              onPressed: () => setState(() {
                _step = 0;
                _selectedService = null;
              }),
              child: const Text(
                'Torna ai servizi',
                style: TextStyle(
                  fontFamily: 'Montserrat',
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTimeSlotsStep() {
    if (_timeSlots.isEmpty) {
      return const Center(child: Text('Nessun orario disponibile'));
    }
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 30, 16, 8),
          child: Text(
            'Orari disponibili',
            style: TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: _timeSlots.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (_, i) {
              final ts = _timeSlots[i];
              final selected = _selectedTimeSlot == ts;
              return GestureDetector(
                onTap: () => setState(() => _selectedTimeSlot = ts),
                child: Card(
                  shadowColor: Colors.white,
                  color: selected ? Colors.indigo[200] : Colors.white70,
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                    child: Row(
                      children: [
                        // Colonna data
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                // Format dd-MM-yy
                                DateFormat('dd-MM-yy').format(DateTime.parse(ts['date'] as String)),
                                style: const TextStyle(
                                  color: Colors.black,
                                  fontFamily: 'Montserrat',
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                _selectedService!['name'],
                                style: const TextStyle(
                                  color: Colors.black54,
                                  fontFamily: 'Montserrat',
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Orario grande a destra
                        Text(
                          _formatTime(ts['startTime'] as String),
                          style: const TextStyle(
                            color: Colors.black,
                            fontFamily: 'Montserrat',
                            fontWeight: FontWeight.bold,
                            fontSize: 24,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton(
                  onPressed: () => setState(() {
                    _step = 1;
                    _selectedDay = null;
                    _timeSlots = [];
                    _selectedTimeSlot = null;
                  }),
                  child: const Text(
                    'Torna alle date',
                    style: TextStyle(
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                  foregroundColor: Colors.white,
                ),
                onPressed: _selectedTimeSlot == null ? null : _book,
                child: const Text(
                  'Prenota',
                  style: TextStyle(
                    fontFamily: 'Montserrat',
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
