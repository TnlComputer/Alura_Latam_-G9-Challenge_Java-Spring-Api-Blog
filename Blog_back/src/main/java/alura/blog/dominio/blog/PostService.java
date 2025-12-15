package alura.blog.dominio.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
        return repository.findByActivoTrue(PageRequest.of(page, size)).toList();
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
    public void delete(Post post) {
        post.eliminar();
        repository.save(post);
    }

    public void deleteById(Long id) {
        findById(id).ifPresent(post -> {
            post.eliminar();
            save(post);
        });
    }

}

