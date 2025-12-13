package alura.blog.dominio.usuario;

import alura.blog.infra.security.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public UserService(
            UserRepository repo,
            PasswordEncoder passwordEncoder,
            TokenService tokenService
    ) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

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
}
