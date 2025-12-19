//package alura.blog.infra.security;
//
//import alura.blog.dominio.usuario.User;
//import alura.blog.dominio.usuario.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
//
//    private final UserRepository userRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        // Buscar usuario por email
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
//
//        // Convertir roles de la tabla a GrantedAuthority de Spring Security
//        Set<SimpleGrantedAuthority> authorities = user.getRoles().stream()
//                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
//                .collect(Collectors.toSet());
//
//        // Log para ver en consola quién se está logueando y con qué roles
//        System.out.println("LOGIN EXITOSO: Usuario: " + user.getEmail());
//        System.out.println("Roles cargados en GrantedAuthority: " + authorities);
//
//        // Devolver UserDetails para que Spring Security lo use
//        return new org.springframework.security.core.userdetails.User(
//                user.getEmail(),
//                user.getPassword(),
//                user.getEnabled(), // habilitado
//                true,              // accountNonExpired
//                true,              // credentialsNonExpired
//                true,              // accountNonLocked
//                authorities
//        );
//    }
//}
package alura.blog.infra.security;

import alura.blog.dominio.usuario.User;
import alura.blog.dominio.usuario.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscar usuario en DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Convertir roles a GrantedAuthority con prefijo ROLE_ solo para Spring Security
        var authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toSet());

        // Logging opcional
        System.out.println("LOGIN EXITOSO: Usuario: " + user.getEmail());
        System.out.println("Roles cargados en GrantedAuthority: " + authorities);

        // Crear UserDetails
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getEnabled(),
                true,  // accountNonExpired
                true,  // credentialsNonExpired
                true,  // accountNonLocked
                authorities
        );
    }
}
