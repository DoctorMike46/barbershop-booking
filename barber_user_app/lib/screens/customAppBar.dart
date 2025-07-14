// lib/widgets/custom_appbar.dart
import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final bool showBack;
  final VoidCallback? onMessagePressed;

  const CustomAppBar({
    super.key,
    required this.title,
    this.showBack = true,
    this.onMessagePressed,
  });

  @override
  Size get preferredSize => const Size.fromHeight(60);

  @override
  Widget build(BuildContext context) {
    return Container(
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
          leading: showBack
              ? IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          )
              : null,
          title: Text(
            title,
            style: const TextStyle(
              fontFamily: "Montserrat",
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
              color: Colors.white,
            ),
          ),
          centerTitle: true,
          actions: onMessagePressed != null
              ? [
            IconButton(
              icon: const Icon(Icons.message, color: Colors.black),
              onPressed: onMessagePressed,
            ),
          ]
              : null,
        ),
      ),
    );
  }
}
