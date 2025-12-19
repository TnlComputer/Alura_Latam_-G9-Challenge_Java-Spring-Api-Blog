//package alura.blog.dominio.usuario;
//
//
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Service
//public class AppUserDetailsService implements UserDetailsService {
//
//    private final UserRepository userRepository;
//
//    public AppUserDetailsService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String email)
//            throws UsernameNotFoundException {
//
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() ->
//                        new UsernameNotFoundException("Usuario no encontrado"));
//
//        Set<GrantedAuthority> authorities = user.getRoles().stream()
//                .map(role -> new SimpleGrantedAuthority(role.name()))
//                .collect(Collectors.toSet());
//
//        return org.springframework.security.core.userdetails.User.builder()
//                .username(user.getEmail())
//                .password(user.getPassword())
//                .authorities(authorities)
//                .disabled(!user.getEnabled())
//                .build();
//    }
//}

//package alura.blog.dominio.usuario;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class AppUserDetailsService implements UserDetailsService {
//
//    private final UserRepository userRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
//
//        // Aquí se quita "ROLE_" para que Spring lo gestione automáticamente
//        return new org.springframework.security.core.userdetails.User(
//                user.getEmail(),
//                user.getPassword(),
//                user.getEnabled(),
//                true,
//                true,
//                true,
//                user.getRoles().stream()
//                        .map(role -> "ROLE_" + role.name())
//                        .map(SimpleGrantedAuthority::new)
//                        .collect(Collectors.toSet())
//        );
//    }
//}
