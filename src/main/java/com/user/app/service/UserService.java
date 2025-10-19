package com.user.app.service;


import com.user.app.dto.AuthResponse;
import com.user.app.dto.LoginRequest;
import com.user.app.dto.UserRegistrationRequest;
import com.user.app.dto.UserResponse;
import com.user.app.entity.User;
import com.user.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RequiredArgsConstructor
@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    public AuthResponse registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("User with this email already exists");
        }

        // Create user in Keycloak
        String keycloakId = keycloakService.createUser(request);

        // Save user to database
        Set<String> roles= new HashSet<>();
        roles.add("USER");

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .keycloakId(keycloakId)
                .roles(roles)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        // Authenticate and get tokens
        LoginRequest loginRequest = new LoginRequest(request.getEmail(), request.getPassword());
        Map<String, Object> tokenResponse = keycloakService.authenticateUser(loginRequest);

        return AuthResponse.builder()
                .accessToken((String) tokenResponse.get("access_token"))
                .refreshToken((String) tokenResponse.get("refresh_token"))
                .expiresIn(((Number) tokenResponse.get("expires_in")).longValue())
                .tokenType((String) tokenResponse.get("token_type"))
                .user(mapToUserResponse(user))
                .build();


    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .roles(user.getRoles())
                .addedDate(user.getAddedDate())
                .enabled(user.getEnabled())
                .build();
    }



}
