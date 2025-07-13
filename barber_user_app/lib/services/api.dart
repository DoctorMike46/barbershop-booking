import 'dart:io';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class Api {
  // Host per iOS Simulator / Android emulator
  static final _host = Platform.isAndroid ? '10.0.2.2' : 'localhost';

  // Base URL principali
  static final _authUrl = 'http://$_host:8080/api/auth';
  static final _apiUrl  = 'http://$_host:8080/api';

  // dichiarazione storage
  static const _storage = FlutterSecureStorage();

  // Login: salva il token in secure storage
  static Future<String?> login(String email, String password) async {
    final uri = Uri.parse('$_authUrl/login');
    final res = await http.post(uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (res.statusCode == 200) {
      final token = (jsonDecode(res.body) as Map)['token'] as String;
      await _storage.write(key: 'jwt', value: token);
      return token;
    }
    return null;
  }

  // Register: salva il token subito dopo la registrazione
  static Future<String?> register({
    required String name,
    required String email,
    required String password,
    required String telefono,
    String role = 'USER',
  }) async {
    final uri = Uri.parse('$_authUrl/register');
    final res = await http.post(uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'telefono': telefono,
        'role': role,
      }),
    );
    if (res.statusCode == 200) {
      final token = (jsonDecode(res.body) as Map)['token'] as String;
      await _storage.write(key: 'jwt', value: token);
      return token;
    }
    return null;
  }

  // Recupera il profilo protetto con il JWT
  static Future<Map<String, dynamic>?> getProfile() async {
    final token = await _storage.read(key: 'jwt');
    if (token == null) return null;

    final uri = Uri.parse('$_apiUrl/users/me');
    final res = await http.get(uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (res.statusCode == 200) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    return null;
  }

  // Recupera le prenotazioni di un utente
  static Future<List<Map<String, dynamic>>?> getBookings() async {
    final token = await _storage.read(key: 'jwt');
    if (token == null) return null;

    final uri = Uri.parse('$_apiUrl/bookings/me');
    final res = await http.get(uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    final List<dynamic> jsonList = jsonDecode(res.body) as List<dynamic>;

    if (res.statusCode == 200) {
      return jsonList.map((e) => e as Map<String, dynamic>).toList();
    }
    return null;
  }

  /// Chiama DELETE /api/bookings/{id} per annullare la prenotazione
  static Future<bool> cancelBooking(String bookingId) async {
    final token = await _storage.read(key: 'jwt');
    if (token == null) return false;

    final uri = Uri.parse('$_apiUrl/bookings/$bookingId');
    final res = await http.delete(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    return res.statusCode == 200;
  }

  // recupero gli annunci
  static Future<List<Map<String, dynamic>>?> getAnnouncements() async {
    final token = await _storage.read(key: 'jwt');
    if (token == null) return null;
    final uri = Uri.parse('$_apiUrl/announcements');
    final res = await http.get(uri, headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });
    if (res.statusCode == 200) {
      final List<dynamic> list = jsonDecode(res.body) as List<dynamic>;
      return list.map((e) => e as Map<String, dynamic>).toList();
    }
    return null;
  }

  // recupero i prodotti
  static Future<List<Map<String, dynamic>>?> getProducts() async {
    final token = await _storage.read(key: 'jwt');
    if (token == null) return null;
    final uri = Uri.parse('$_apiUrl/products');
    final res = await http.get(uri, headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });
    if (res.statusCode == 200) {
      final List<dynamic> list = jsonDecode(res.body) as List<dynamic>;
      return list.map((e) => e as Map<String, dynamic>).toList();
    }
    return null;
  }

  // recupero i giorni lavorativi del salone
  static Future<List<Map<String, dynamic>>?> getWorkingDays() async {
    final token = await _storage.read(key: 'jwt');
    if (token == null) return null;
    final uri = Uri.parse('$_apiUrl/working-hours');
    final res = await http.get(uri, headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });
    if (res.statusCode == 200) {
      final List<dynamic> list = jsonDecode(res.body) as List<dynamic>;
      return list.map((e) => e as Map<String, dynamic>).toList();
    }
    return null;
  }

  // recupero i servizi del salone
  static Future<List<Map<String, dynamic>>?> getServices() async {
    final token = await _storage.read(key: 'jwt');
    if (token == null) return null;
    final uri = Uri.parse('$_apiUrl/services');
    final res = await http.get(uri, headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });
    if (res.statusCode == 200) {
      final List<dynamic> list = jsonDecode(res.body) as List<dynamic>;
      return list.map((e) => e as Map<String, dynamic>).toList();
    }
    return null;
  }



  // recupero i timeSlot disponibili in base alla durata del servizio e al giorno
  static Future<List<Map<String, dynamic>>?> getTimeSlots(String date,int durationService) async {
    final token = await _storage.read(key: 'jwt');
    if (token == null) return null;

    final uri = Uri.parse('$_apiUrl/timeslots/available?date=$date&duration=$durationService');
    final res = await http.get(uri, headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });
    if (res.statusCode == 200) {
      final List<dynamic> list = jsonDecode(res.body) as List<dynamic>;
      return list.map((e) => e as Map<String, dynamic>).toList();
    }
    return null;
  }

  /// Recupera i giorni disponibili (lista di date ISO string)
  static Future<List<String>?> getAvailableDays() async {
    final token = await _storage.read(key: 'jwt');
    if (token == null) return null;

    final uri = Uri.parse('$_apiUrl/timeslots/available-days');
    final res = await http.get(uri, headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    });

    if (res.statusCode == 200) {
      final raw = jsonDecode(res.body) as List<dynamic>;
      // Mappa ogni elemento a String, non a Map
      return raw.map((e) => e as String).toList();
    }
    return null;
  }


  static Future<bool?> createBooking( {
     required int serviceId,
     required int timeSlotId,
  }) async {
    final token = await _storage.read(key: 'jwt');
    if (token == null) return null;

    final uri = Uri.parse('$_apiUrl/bookings');
    final res = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'serviceId': serviceId,
        'timeSlotId': timeSlotId,
      }),
    );

    if (res.statusCode == 200) {
      final map = jsonDecode(res.body) as Map<String, dynamic>;
      return true;
    }
    return null;
  }

}
