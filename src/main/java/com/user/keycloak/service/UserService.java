package com.user.keycloak.service;


import com.user.keycloak.dto.AuthResponse;
import com.user.keycloak.dto.LoginRequest;
import com.user.keycloak.dto.UserRegistrationRequest;
import com.user.keycloak.entity.User;
import com.user.keycloak.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;

    public AuthResponse registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("User with this email already exists");
        }

        // Create user in Keycloak

        // Save user to database
        Set<String> roles= new HashSet<>();
        roles.add("USER");

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                //.keycloakId(keycloakId)
                .roles(roles)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        // Authenticate and get tokens
        LoginRequest loginRequest = new LoginRequest(request.getEmail(), request.getPassword());


        return AuthResponse.builder()
                .build();



    }



}
