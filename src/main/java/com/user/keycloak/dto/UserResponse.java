package com.user.keycloak.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Set<String> roles;
    private LocalDateTime addedDate;
    private Boolean enabled;


}

