import 'package:flutter/material.dart';

class CutsGalleryWidget extends StatelessWidget {
  const CutsGalleryWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> imageUrls = [
      'https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1613459629697-6673bc587e0d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1608219959307-478e1e0b1d9a?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1588776814546-ec1a1f362b59?auto=format&fit=crop&w=400&q=80',
    ];

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: imageUrls.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemBuilder: (context, index) {
        final imageUrl = imageUrls[index];
        return GestureDetector(
          onTap: () {
            showDialog(
              context: context,
              builder: (_) => Dialog(
                backgroundColor: Colors.transparent,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(imageUrl, fit: BoxFit.cover),
                ),
              ),
            );
          },
          child: Hero(
            tag: 'cut_$index',
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.network(
                imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const Icon(Icons.broken_image),
              ),
            ),
          ),
        );
      },
    );
  }
}
