package alura.blog.dominio.usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // necesario para buscar el autor
    boolean existsByEmail(String email);       // opcional, para validar registros
}