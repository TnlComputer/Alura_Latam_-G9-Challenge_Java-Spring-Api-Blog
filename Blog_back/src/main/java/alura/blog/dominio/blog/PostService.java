package alura.blog.dominio.blog;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository repository;

    public PostService(PostRepository repository) {
        this.repository = repository;
    }

    // -------------------- LISTAR TODOS LOS POSTS ACTIVOS --------------------
    public List<Post> findAllActive(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return repository.findAllActiveFiltered(null, null, pageable).getContent();
    }

    // -------------------- LISTAR TODOS LOS POSTS (SIN FILTRO) --------------------
    public List<Post> findAll() {
        return repository.findAll();
    }

    // -------------------- OBTENER POST POR ID --------------------
    public Optional<Post> findById(Long id) {
        return repository.findById(id);
    }

    // -------------------- GUARDAR O ACTUALIZAR POST --------------------
    public Post save(Post post) {
        return repository.save(post);
    }

    // -------------------- BORRAR POST (MARCAR ACTIVO = FALSE) --------------------
    public void deleteById(Long id) {
        findById(id).ifPresent(post -> {
            post.eliminar();
            save(post);
        });
    }

    // -------------------- LISTAR POSTS FILTRADOS --------------------
    public List<Post> findAllActiveFiltered(int page, int size, Long authorId, String category, String sort) {
        // Crear Pageable según sort recibido
        Sort.Direction direction = Sort.Direction.DESC; // por defecto descendente
        String property = "createdAt";

        if (sort != null && sort.contains(",")) {
            String[] sortParts = sort.split(",");
            property = sortParts[0];
            direction = sortParts[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));

        // Usar solo la query personalizada
        return repository.findAllActiveFiltered(authorId, category, pageable).getContent();
    }
}
