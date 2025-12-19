package alura.blog.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JWTFilter jwtFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(UserDetailsService uds,
                          JWTFilter jwtFilter,
                          CorsConfigurationSource corsConfigurationSource) {
        this.userDetailsService = uds;
        this.jwtFilter = jwtFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // =====================
                        // CORS PREFLIGHT
                        // =====================
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // =====================
                        // AUTH
                        // =====================
                        .requestMatchers("/auth/**").permitAll()

                        // =====================
                        // GET PÚBLICO
                        // =====================
                        .requestMatchers(HttpMethod.GET, "/api/posts/**", "/api/categories/**").permitAll()

                        // =====================
                        // ADMIN API (CRUD POSTS)
                        // =====================
                        .requestMatchers(HttpMethod.GET, "/api/admin/**").hasAnyRole("ADMIN", "SUPER")
                        .requestMatchers(HttpMethod.POST, "/api/admin/**").hasAnyRole("ADMIN", "SUPER")
                        .requestMatchers(HttpMethod.PUT, "/api/admin/**").hasAnyRole("ADMIN", "SUPER")
                        .requestMatchers(HttpMethod.PATCH, "/api/admin/**").hasAnyRole("ADMIN", "SUPER")
                        .requestMatchers(HttpMethod.DELETE, "/api/admin/**").hasAnyRole("ADMIN", "SUPER")

                        // =====================
                        // BLOG USUARIOS
                        // =====================
                        .requestMatchers("/api/posts/**")
                        .hasAnyRole("USER", "COORDINATOR", "ADMIN", "SUPER")

                        // =====================
                        // HTML ADMIN
                        // =====================
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "SUPER")

                        // =====================
                        // RESTO
                        // =====================
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .cors(cors -> cors.configurationSource(corsConfigurationSource)) // usa tu CorsConfig
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

    /// /                .authorizeHttpRequests(auth -> auth
    /// /                        // Auth
    /// /                        .requestMatchers("/auth/**").permitAll()
    /// /
    /// /                        // GET público para posts y categorías
    /// /                        .requestMatchers(HttpMethod.GET, "/api/posts/**", "/api/categories/**").permitAll()
    /// /
    /// /                        // Admin
    /// /                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "SUPER")
    /// /
    /// /                        // Blog / posts (creación, modificación, eliminación)
    /// /                        .requestMatchers("/api/posts/**").hasAnyRole("USER", "COORDINATOR", "ADMIN", "SUPER")
    /// /
    /// /                        // Cualquier otro endpoint
    /// /                        .anyRequest().authenticated()
    /// /                )
//                .authorizeHttpRequests(auth -> auth
//
//                        // CORS PREFLIGHT
//                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//
//                        // AUTH
//                        .requestMatchers("/auth/**").permitAll()
//
//                        // GET público
//                        .requestMatchers(HttpMethod.GET, "/api/posts/**", "/api/categories/**").permitAll()
//
//                        // ADMIN API
//                        .requestMatchers(HttpMethod.GET, "/api/admin/**").hasAnyRole("ADMIN", "SUPER")
//                        .requestMatchers(HttpMethod.POST, "/api/admin/**").hasAnyRole("ADMIN", "SUPER")
//                        .requestMatchers(HttpMethod.PUT, "/api/admin/**").hasAnyRole("ADMIN", "SUPER")
//                        .requestMatchers(HttpMethod.PATCH, "/api/admin/**").hasAnyRole("ADMIN", "SUPER")
//                        .requestMatchers(HttpMethod.DELETE, "/api/admin/**").hasAnyRole("ADMIN", "SUPER")
//
//                        // BLOG USUARIOS
//                        .requestMatchers("/api/posts/**")
//                        .hasAnyRole("USER", "COORDINATOR", "ADMIN", "SUPER")
//
//                        // HTML ADMIN
//                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "SUPER")
//
//                        .anyRequest().authenticated()
//                )
//
//
//                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
