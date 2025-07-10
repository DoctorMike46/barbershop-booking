package com.barbershop.bookingsystem.service;

import com.barbershop.bookingsystem.model.User;
import com.barbershop.bookingsystem.repository.UserRepository;
import com.barbershop.bookingsystem.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato: " + email));
        return new CustomUserDetails(user);
    }
}
