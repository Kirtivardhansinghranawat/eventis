package com.eventis.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.eventis.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> {})

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Authentication is public
                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login"
                ).permitAll()

                // Public event browsing
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/events",
                    "/api/events/{id}"
                ).permitAll()

                // Organiser's own events
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/events/organiser/my-events"
                ).hasRole("ORGANISER")

                // Only organisers can create events
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/events"
                ).hasRole("ORGANISER")

                // Only organisers can update events
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/events/{id}"
                ).hasRole("ORGANISER")

                // Only organisers can delete events
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/events/{id}"
                ).hasRole("ORGANISER")

                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}