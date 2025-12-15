package alura.blog.dominio.usuario;

import alura.blog.infra.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository repo;
    private final TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository repo, TokenService tokenService) {
        this.repo = repo;
        this.tokenService = tokenService;
    }

    // ------------------------
    // Registro y login
    // ------------------------
    public void register(DatosRegistroUsuario datos) {
        if (repo.findByEmail(datos.email()).isPresent()) {
            throw new RuntimeException("Email ya registrado");
        }

        User user = new User(
                null,
                datos.fullName(),
                datos.email(),
                passwordEncoder.encode(datos.password()),
                true,
                Set.of("ROLE_USER"),
                null,
                null
        );

        repo.save(user);
    }

    public String login(DatosLoginUsuario datos) {
        User user = repo.findByEmail(datos.email())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(datos.password(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return tokenService.generarToken(user);
    }

    // ------------------------
    // Métodos admin
    // ------------------------
    public User crearUsuarioAdmin(DatosAdminUsuario datos) {
        if (repo.existsByEmail(datos.email())) {
            throw new RuntimeException("Email ya registrado");
        }

        User user = new User(
                null,
                datos.fullName(),
                datos.email(),
                datos.password() != null ? passwordEncoder.encode(datos.password()) : "",
                datos.enabled() != null ? datos.enabled() : true,
                datos.roles(),
                null,
                null
        );

        return repo.save(user);
    }

    public User actualizarUsuarioAdmin(Long id, DatosAdminUsuario datos) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (datos.fullName() != null) user.setFullName(datos.fullName());
        if (datos.email() != null) user.setEmail(datos.email());
        if (datos.password() != null) user.setPassword(passwordEncoder.encode(datos.password()));
        if (datos.enabled() != null) user.setEnabled(datos.enabled());
        if (datos.roles() != null) user.setRoles(datos.roles());

        return repo.save(user);
    }

    public void eliminarUsuarioAdmin(Long id) {
        repo.deleteById(id);
    }

    public List<User> listarUsuarios() {
        return repo.findAll();
    }

    // ------------------------
    // Método para PostController
    // ------------------------
    public User findByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
    }
}
