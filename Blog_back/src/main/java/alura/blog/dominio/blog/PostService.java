package alura.blog.dominio.blog;

import alura.blog.dominio.category.Category;
import alura.blog.dominio.category.CategoryRepository;
import alura.blog.dominio.usuario.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository repository;
    private final CategoryRepository categoryRepository;

    public PostService(PostRepository repository, CategoryRepository categoryRepository) {
        this.repository = repository;
        this.categoryRepository = categoryRepository;
    }

    // -------------------- CREAR POST --------------------
    public Post crearPost(DatosRegistroPost datos, User autor) {
        // Si no se envía categoryId, buscar "General"
        Category category;
        if (datos.categoryId() != null) {
            category = categoryRepository.findById(datos.categoryId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        } else {
            category = categoryRepository.findByName("General")
                    .orElseThrow(() -> new RuntimeException("Categoría General no existe"));
        }

        Post post = new Post(datos, category);
        post.setAuthor(autor); // asignar autor actual
        post.setActivo(true); // asegurar activo
        return repository.save(post);
    }

    // -------------------- GUARDAR --------------------
    public Post save(Post post) {
        return repository.save(post);
    }

    // -------------------- BUSCAR POR ID --------------------
    public Optional<Post> findById(Long id) {
        return repository.findById(id);
    }

    // -------------------- SOFT DELETE --------------------
    public void deleteById(Long id) {
        findById(id).ifPresent(post -> {
            post.eliminar();
            save(post);
        });
    }

    //    public void eliminar(Long id) {
//        Post post = repository.findById(id)
//                .orElseThrow();
//
//        post.setActivo(false);
//        post.setStatus(PostStatus.ELIMINADO);
//        post.setUpdatedAt(LocalDateTime.now());
//
//        repository.save(post);
//    }
    @Transactional
    public void toggleEstado(Long id) {
        Post post = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        if (post.isActivo()) {
            post.setActivo(false);
            post.setStatus(PostStatus.ELIMINADO);
        } else {
            post.setActivo(true);
            post.setStatus(PostStatus.ABIERTO);
        }

        post.setUpdatedAt(LocalDateTime.now());
    }


    // -------------------- LISTAR POSTS FILTRADOS --------------------
    public List<Post> findAllActiveFiltered(int page, int size, Long authorId, Long categoryId, String sort, String search) {
        Sort.Direction direction = Sort.Direction.DESC;
        String property = "createdAt";

        if (sort != null && sort.contains(",")) {
            String[] sortParts = sort.split(",");
            property = sortParts[0];
            direction = sortParts[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));

        return repository.findAllFiltered(authorId, categoryId, search, pageable).getContent();
    }


    public Page<Post> findPostsFiltered(Long authorId, Long categoryId, String search, Pageable pageable) {
        return repository.findAllFiltered(authorId, categoryId, search, pageable);
    }


    public Post actualizar(Long id, DatosRegistroPost datos) {
        Post post = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        post.setTitle(datos.title());
        post.setMensaje(datos.mensaje());
        post.setExcerpt(generarExcerpt(datos.mensaje()));
        post.setUpdatedAt(LocalDateTime.now());

        if (datos.categoryId() != null) {
            Category category = categoryRepository.findById(datos.categoryId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            post.setCategory(category);
        }

        return repository.save(post);
    }

    private String generarExcerpt(String mensaje) {
        if (mensaje == null) return "";
        return mensaje.length() > 100 ? mensaje.substring(0, 100) + "..." : mensaje;
    }


}
