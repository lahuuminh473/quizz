package com.minhhuu.quizz.controller;

import com.minhhuu.quizz.dto.AuthRequest;
import com.minhhuu.quizz.dto.AuthResponse;
import com.minhhuu.quizz.dto.RegisterRequest;
import com.minhhuu.quizz.entity.Role;
import com.minhhuu.quizz.entity.User;
import com.minhhuu.quizz.exception.UserAlreadyExistsException;
import com.minhhuu.quizz.repository.UserRepository;
import com.minhhuu.quizz.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUserName(request.getUsername())) {
            throw new UserAlreadyExistsException("Username đã tồn tại: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email đã tồn tại: " + request.getEmail());
        }

        User user = new User();
        user.setUserName(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setRole(Role.USER); // default role
        userRepository.save(user);

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getUserName(), user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        String token = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token, user.getUserName(), "USER", user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        User user = userRepository.findByUserName(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getUserName(), user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
        String token = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token, user.getUserName(), user.getRole().name(), user.getId()));
    }
}
