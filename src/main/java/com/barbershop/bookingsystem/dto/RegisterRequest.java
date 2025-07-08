package com.barbershop.bookingsystem.dto;

import com.barbershop.bookingsystem.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role; // USER o ADMIN
}
