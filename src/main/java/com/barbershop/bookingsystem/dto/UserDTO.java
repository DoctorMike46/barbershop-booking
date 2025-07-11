package com.barbershop.bookingsystem.dto;

import com.barbershop.bookingsystem.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String telefono;
    private Role role;
    private boolean active;
}
