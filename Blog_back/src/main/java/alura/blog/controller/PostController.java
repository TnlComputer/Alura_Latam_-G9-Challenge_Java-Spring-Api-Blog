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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    // -------------------- LIST POSTS --------------------
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllActive(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Long authorId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        List<PostDTO> posts = postService.findAllActiveFiltered(page, size, authorId, categoryId, sort, search)
                .stream()
                .map(PostDTO::fromPost)
                .toList();

        return ResponseEntity.ok(posts);
    }

    // -------------------- GET BY ID --------------------
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getById(@PathVariable Long id) {
        Optional<Post> post = postService.findById(id);
        return post.map(PostDTO::fromPost)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // -------------------- CREATE --------------------
    @PostMapping
    public ResponseEntity<PostDTO> crearPost(@RequestBody DatosRegistroPost datos,
                                             @AuthenticationPrincipal String email) {
        User usuarioActual = userService.findByEmail(email);
        if (usuarioActual == null) {
            return ResponseEntity.status(401).build(); // no autorizado
        }

        Post post = new Post();
        post.setTitle(datos.title());      // record accessor, no getTitle()
        post.setMensaje(datos.mensaje());  // content = mensaje
        post.setMensaje(datos.mensaje());

        if (datos.categoryId() != null) {
            Category category = categoryService.findById(datos.categoryId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            post.setCategory(category);
        }

        post.setAuthor(usuarioActual);
        post.setCreatedAt(LocalDateTime.now());

        Post savedPost = postService.save(post);

        return ResponseEntity.ok(PostDTO.fromPost(savedPost));
    }



    // -------------------- UPDATE --------------------
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPER', 'COORDINATOR')")
    public ResponseEntity<PostDTO> update(@PathVariable Long id,
                                          @RequestBody DatosRegistroPost datos,
                                          @AuthenticationPrincipal String email) {
        Optional<Post> existing = postService.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        Post post = existing.get();

        // Validar que el autor sea el mismo o que tenga rol de ADMIN
        User user = userService.findByEmail(email);
        if (!post.getAuthor().getId().equals(user.getId()) && !user.getRoles().contains("ADMIN")) {
            return ResponseEntity.status(403).build();
        }

        post.setTitle(datos.title());
//        post.setContent(datos.content());
        post.setMensaje(datos.mensaje());

        if (datos.categoryId() != null) {
            Category category = categoryService.findById(datos.categoryId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            post.setCategory(category);
        }

        post.setUpdatedAt(LocalDateTime.now());
        Post updated = postService.save(post);

        return ResponseEntity.ok(PostDTO.fromPost(updated));
    }

    // -------------------- DELETE (soft delete) --------------------
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPER', 'COORDINATOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal String email) {
        Optional<Post> existing = postService.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        Post post = existing.get();
        User user = userService.findByEmail(email);

        // Solo autor o ADMIN puede eliminar
        if (!post.getAuthor().getId().equals(user.getId()) && !user.getRoles().contains("ADMIN")) {
            return ResponseEntity.status(403).build();
        }

        post.eliminar();
        postService.save(post);
        return ResponseEntity.noContent().build();
    }
}
