package com.barbershop.bookingsystem.repository;

import com.barbershop.bookingsystem.model.Role;
import com.barbershop.bookingsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);
}
