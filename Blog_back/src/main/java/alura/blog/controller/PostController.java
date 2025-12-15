package alura.blog.controller;

import alura.blog.dominio.blog.DatosRegistroPost;
import alura.blog.dominio.blog.Post;
import alura.blog.dominio.blog.PostDTO;
import alura.blog.dominio.blog.PostService;
import alura.blog.dominio.category.Category;
import alura.blog.dominio.category.CategoryService;
import alura.blog.dominio.usuario.User;
import alura.blog.dominio.usuario.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final UserService userService;
    private final CategoryService categoryService;

    public PostController(PostService postService, UserService userService, CategoryService categoryService) {
        this.postService = postService;
        this.userService = userService;
        this.categoryService = categoryService;
    }


    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllActive(
            @RequestParam(defaultValue = "0") int page,    // Paginación
            @RequestParam(defaultValue = "6") int size,    // Tamaño de página
            @RequestParam(required = false) Long authorId,  // Filtro por autor
            @RequestParam(required = false) String category, // Filtro por categoría
            @RequestParam(defaultValue = "createdAt,desc") String sort) { // Orden descendente

        // Llamar al servicio que maneja la consulta filtrada y paginada
        List<PostDTO> posts = postService.findAllActiveFiltered(page, size, authorId, category, sort)
                .stream()
                .map(PostDTO::fromPost)
                .toList();

        return ResponseEntity.ok(posts);
    }


    // -------------------- GET BY ID --------------------
    @GetMapping("/{id}")
    public ResponseEntity<Post> getById(@PathVariable Long id) {
        Optional<Post> post = postService.findById(id);
        return post.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------- CREATE --------------------
    @PostMapping
    public ResponseEntity<Post> create(@RequestBody DatosRegistroPost datos,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();

        User author = userService.findByEmail(userDetails.getUsername());
        if (author == null) return ResponseEntity.status(404).build();

        // Buscar categoría
        Category category = categoryService.findById(datos.categoryId())
                .orElse(categoryService.findByName("general")
                        .orElseThrow(() -> new RuntimeException("No existe categoría 'general'")));

        Post post = new Post(datos, category);
        post.setAuthor(author);
        Post savedPost = postService.save(post);

        return ResponseEntity.ok(savedPost);
    }


    // -------------------- UPDATE --------------------
    @PutMapping("/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @RequestBody DatosRegistroPost datos) {
        Optional<Post> existing = postService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Post post = existing.get();
        post.setTitle(datos.title());
        post.setContent(datos.content());
        post.setMensaje(datos.mensaje());
        post.setUpdatedAt(LocalDateTime.now());
        Post updated = postService.save(post);
        return ResponseEntity.ok(updated);
    }

    // -------------------- DELETE (soft delete) --------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Optional<Post> existing = postService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Post post = existing.get();
        post.eliminar(); // marca como inactivo
        postService.save(post);
        return ResponseEntity.noContent().build();
    }
}
