package alura.blog.infra.security;

import alura.blog.dominio.usuario.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generarToken(User user) {

        Algorithm algorithm = Algorithm.HMAC256(secret);

        return JWT.create()
                .withIssuer("alura-blog")
                .withSubject(user.getEmail())
                .withArrayClaim(
                        "roles",
                        user.getRoles().toArray(new String[0])
                )
                .withExpiresAt(
                        Instant.now().plus(2, ChronoUnit.HOURS)
                )
                .sign(algorithm);
    }
}
