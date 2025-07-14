import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class NextBookingCountdown extends StatefulWidget {
  final DateTime nextBookingDate;

  const NextBookingCountdown({required this.nextBookingDate, Key? key}) : super(key: key);

  @override
  State<NextBookingCountdown> createState() => _NextBookingCountdownState();
}

class _NextBookingCountdownState extends State<NextBookingCountdown> {
  late Duration _timeLeft;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _updateTimeLeft();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateTimeLeft();
    });
  }

  void _updateTimeLeft() {
    final now = DateTime.now();
    setState(() {
      _timeLeft = widget.nextBookingDate.difference(now);
      if (_timeLeft.isNegative) _timeLeft = Duration.zero;
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  double _progress() {
    final total = widget.nextBookingDate.difference(DateTime.now()).inSeconds;
    final max = widget.nextBookingDate.difference(DateTime.now().subtract(const Duration(days: 1))).inSeconds;
    return max > 0 ? total / max : 0;
  }

  @override
  Widget build(BuildContext context) {
    final days = _timeLeft.inDays;
    final hours = _timeLeft.inHours % 24;
    final minutes = _timeLeft.inMinutes % 60;
    final seconds = _timeLeft.inSeconds % 60;

    return Center(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.indigo[100],
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.2)),
          boxShadow: [
            BoxShadow(color: Colors.white70, blurRadius: 10, offset: Offset(0, 4)),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CustomPaint(
              foregroundPainter: CircleCountdownPainter(progress: _progress()),
              child: SizedBox(
                width: 180,
                height: 180,
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('$days giorni', style: TextStyle(
                          fontSize: 18,
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                          fontFamily: "Montserrat"
                      )
                      ),
                      Text('$hours h $minutes m $seconds s', style: TextStyle(
                          fontSize: 16,
                          color: Colors.black,
                          fontFamily: "Montserrat"
                      )),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Prossima prenotazione:\n${DateFormat('dd/MM/yyyy – HH:mm').format(widget.nextBookingDate)}',
              style: TextStyle(
                  fontSize: 14,
                  color: Colors.black,
                  fontFamily: "Montserrat",
                  fontWeight: FontWeight.bold

              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class CircleCountdownPainter extends CustomPainter {
  final double progress;

  CircleCountdownPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final Paint baseCircle = Paint()
      ..strokeWidth = 10
      ..color = Colors.white.withOpacity(0.2)
      ..style = PaintingStyle.stroke;

    final Paint progressCircle = Paint()
      ..strokeWidth = 10
      ..color = Colors.indigo[300]!
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final Offset center = Offset(size.width / 2, size.height / 2);
    final double radius = (size.width / 2) - 10;

    canvas.drawCircle(center, radius, baseCircle);

    double angle = 2 * pi * progress;
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), -pi / 2, angle, false, progressCircle);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
