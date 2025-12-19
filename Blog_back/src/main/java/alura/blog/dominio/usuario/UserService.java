//package alura.blog.dominio.usuario;
//
//import alura.blog.infra.security.TokenService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Service
//public class UserService {
//
//    private final UserRepository repo;
//    private final TokenService tokenService;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    public UserService(UserRepository repo, TokenService tokenService) {
//        this.repo = repo;
//        this.tokenService = tokenService;
//    }
//
//    // ------------------------
//    // Registro y login
//    // ------------------------
//    public void register(DatosRegistroUsuario datos) {
//
//        if (repo.findByEmail(datos.email()).isPresent()) {
//            throw new RuntimeException("Email ya registrado");
//        }
//
//        User user = new User(
//                null,
//                datos.fullName(),
//                datos.email(),
//                passwordEncoder.encode(datos.password()),
//                true,
//                Set.of(Role.ROLE_USER),
//                null,
//                null
//        );
//
//        repo.save(user);
//    }
//
//    public String login(DatosLoginUsuario datos) {
//
//        User user = repo.findByEmail(datos.email())
//                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
//
//        if (!passwordEncoder.matches(datos.password(), user.getPassword())) {
//            throw new RuntimeException("Credenciales inválidas");
//        }
//
//        return tokenService.generarToken(user);
//    }
//
//    // ------------------------
//    // Métodos ADMIN
//    // ------------------------
//    public User crearUsuarioAdmin(DatosAdminUsuario datos) {
//
//        User user = new User();
//        user.setFullName(datos.fullName());
//        user.setEmail(datos.email());
//        user.setEnabled(Boolean.TRUE.equals(datos.enabled()));
//
//        if (datos.password() != null && !datos.password().isBlank()) {
//            user.setPassword(passwordEncoder.encode(datos.password()));
//        }
//
//        Set<Role> roles = datos.roles().stream()
//                .map(Role::valueOf)
//                .collect(Collectors.toSet());
//
//        user.setRoles(roles);
//
//        return repo.save(user);
//    }
//
//    public User actualizarUsuarioAdmin(Long id, DatosAdminUsuario datos) {
//
//        User user = repo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
//
//        if (datos.fullName() != null) user.setFullName(datos.fullName());
//        if (datos.email() != null) user.setEmail(datos.email());
//        if (datos.enabled() != null) user.setEnabled(datos.enabled());
//
//        if (datos.password() != null && !datos.password().isBlank()) {
//            user.setPassword(passwordEncoder.encode(datos.password()));
//        }
//
//        if (datos.roles() != null) {
//            Set<Role> roles = datos.roles().stream()
//                    .map(Role::valueOf)
//                    .collect(Collectors.toSet());
//            user.setRoles(roles);
//        }
//
//        return repo.save(user);
//    }
//
//
//    public void eliminarUsuarioAdmin(Long id) {
//        repo.deleteById(id);
//    }
//
//    public Page<User> listarUsuarios(Pageable pageable) {
//        return repo.findAll(pageable);
//    }
//
//    // ------------------------
//    // Uso interno (PostController, etc)
//    // ------------------------
//    public User findByEmail(String email) {
//        return repo.findByEmail(email)
//                .orElseThrow(() ->
//                        new RuntimeException("Usuario no encontrado con email: " + email));
//    }
//}

package alura.blog.dominio.usuario;

import alura.blog.infra.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    // ------------------------
    // REGISTRO
    // ------------------------
    @Transactional
    public void register(DatosRegistroUsuario datos) {
        if (repo.findByEmail(datos.email()).isPresent()) {
            throw new RuntimeException("Email ya registrado");
        }

        User user = new User();
        user.setFullName(datos.fullName());
        user.setEmail(datos.email());
        user.setPassword(passwordEncoder.encode(datos.password()));
        user.setEnabled(true);
        user.setRoles(Set.of(Role.USER));

        repo.save(user);
    }

    // ------------------------
    // LOGIN
    // ------------------------
    @Transactional(readOnly = true)
    public String login(DatosLoginUsuario datos) {
        User user = repo.findByEmail(datos.email())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(datos.password(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return tokenService.generarToken(user);
    }

    // ------------------------
    // ADMIN
    // ------------------------
    @Transactional
    public User crearUsuarioAdmin(DatosAdminUsuario datos) {
        User user = new User();
        user.setFullName(datos.fullName());
        user.setEmail(datos.email());
        user.setEnabled(Boolean.TRUE.equals(datos.enabled()));

        if (datos.password() != null && !datos.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(datos.password()));
        }

        Set<Role> roles = datos.roles().stream()
                .map(Role::valueOf)
                .collect(Collectors.toSet());
        user.setRoles(roles);

        return repo.save(user);
    }

    @Transactional
    public User actualizarUsuarioAdmin(Long id, DatosAdminUsuario datos) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (datos.fullName() != null) user.setFullName(datos.fullName());
        if (datos.email() != null) user.setEmail(datos.email());
        if (datos.password() != null && !datos.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(datos.password()));
        }
        if (datos.enabled() != null) user.setEnabled(datos.enabled());

        if (datos.roles() != null) {
            user.setRoles(datos.roles().stream()
                    .map(Role::valueOf)
                    .collect(Collectors.toSet()));
        }

        return repo.save(user);
    }

    @Transactional
    public void eliminarUsuarioAdmin(Long id) {
        repo.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<User> listarUsuarios(Pageable pageable) {
        return repo.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<User> listarUsuariosHabilitados() {
        return repo.findByEnabledTrue(); // solo usuarios habilitados
    }

}

