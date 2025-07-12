package com.barbershop.bookingsystem.controller;

import com.barbershop.bookingsystem.dto.UserDTO;
import com.barbershop.bookingsystem.model.User;
import com.barbershop.bookingsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAll() {
        return userService.findAll();
    }

    @GetMapping("/role-USER")
    public List<User> getUsers() {
        return userService.findByRole();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteById(id);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/disable")
    public void disable(@PathVariable Long id) {
        userService.disableUser(id);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User updatedUser) {
        User existingUser = userService.findById(id).orElseThrow();
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(updatedUser.getRole());
        existingUser.setTelefono(updatedUser.getTelefono());
        existingUser.setActive(updatedUser.isActive());
        return userService.save(existingUser);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        // Mappa l'entità User su UserDTO
        UserDTO dto = new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getTelefono(),
                user.getRole(),
                user.isActive()
        );
        return ResponseEntity.ok(dto);
    }
}
