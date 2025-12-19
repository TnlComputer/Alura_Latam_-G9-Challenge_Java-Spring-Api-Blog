//package alura.blog.infra.security;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Component
//public class JWTFilter extends OncePerRequestFilter {
//
//    @Value("${api.security.token.secret}")
//    private String secret;
//
//    //    private final AppUserDetailsService userDetailsService;
//    private final UserDetailsService userDetailsService; // <- usar la clase correcta
//
//    public JWTFilter(UserDetailsService userDetailsService) {
//        this.userDetailsService = userDetailsService;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain) throws ServletException, IOException {
//
//        String header = request.getHeader("Authorization");
//        if (header == null || !header.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        String token = header.substring(7);
//        try {
//            var decoded = com.auth0.jwt.JWT.require(com.auth0.jwt.algorithms.Algorithm.HMAC256(secret))
//                    .build()
//                    .verify(token);
//
//            String email = decoded.getSubject();
//
//            // ⚡ Cargar UserDetails real desde tu servicio
//            var userDetails = userDetailsService.loadUserByUsername(email);
//
//            // Crear autenticación con roles del UserDetails
//            var authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//            SecurityContextHolder.getContext().setAuthentication(authToken);
//
//        } catch (Exception e) {
//            SecurityContextHolder.clearContext();
//        }
//
//        filterChain.doFilter(request, response);
//    }
//}

package alura.blog.infra.security;

import alura.blog.dominio.usuario.User;
import alura.blog.dominio.usuario.UserService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

//@Component
//@RequiredArgsConstructor
//public class JWTFilter extends OncePerRequestFilter {
//
//    private final TokenService tokenService;
//    private static final String HEADER = "Authorization";
//    private static final String PREFIX = "Bearer ";
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
//                                    FilterChain filterChain) throws ServletException, IOException {
//
//        String header = request.getHeader(HEADER);
//        if (header != null && header.startsWith(PREFIX)) {
//            String token = header.replace(PREFIX, "");
//            String email = tokenService.getSubject(token);
//
//            List<SimpleGrantedAuthority> authorities = JWT.require(Algorithm.HMAC256("123456"))
//                    .build()
//                    .verify(token)
//                    .getClaim("roles")
//                    .asList(String.class)
//                    .stream()
//                    .map(role -> "ROLE_" + role) // <- agregar ROLE_ para Spring Security
//                    .map(SimpleGrantedAuthority::new)
//                    .collect(Collectors.toList());
//
//            UsernamePasswordAuthenticationToken auth =
//                    new UsernamePasswordAuthenticationToken(email, null, authorities);
//            SecurityContextHolder.getContext().setAuthentication(auth);
//        }
//
//        filterChain.doFilter(request, response);
//    }
//}
@Component
public class JWTFilter extends OncePerRequestFilter {

    private final TokenService tokenService;

    public JWTFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.replace("Bearer ", "");

            String email = tokenService.getSubject(token);

            // Extraer roles directamente del JWT
            List<SimpleGrantedAuthority> authorities = JWT.require(Algorithm.HMAC256("123456"))
                    .build()
                    .verify(token)
                    .getClaim("roles")
                    .asList(String.class)
                    .stream()
                    .map(role -> "ROLE_" + role)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
            System.out.println("JWT recibido: " + token);
            System.out.println("Método: " + request.getMethod() + " | URL: " + request.getRequestURI());
            String authHeader = request.getHeader("Authorization");
            System.out.println("Authorization header: " + authHeader);

        }

        filterChain.doFilter(request, response);
    }
}