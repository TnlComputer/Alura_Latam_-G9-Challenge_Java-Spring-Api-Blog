package alura.blog.controller;

import alura.blog.dominio.blog.DatosRegistroPost;
import alura.blog.dominio.blog.Post;
import alura.blog.dominio.blog.PostDTO;
import alura.blog.dominio.blog.PostService;
import alura.blog.dominio.usuario.User;
import alura.blog.dominio.usuario.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
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

    public PostController(PostService postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    // -------------------- GET ALL --------------------
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllActive(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        List<PostDTO> posts = postService.findAllActive(page, size)
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
    public ResponseEntity<Post> create(@RequestBody Post post,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User author = userService.findByEmail(userDetails.getUsername());
        if (author == null) {
            return ResponseEntity.status(404).build();
        }

        post.setAuthor(author);

        // ⚡ Generar excerpt automáticamente si es null
        if (post.getExcerpt() == null || post.getExcerpt().isEmpty()) {
            String content = post.getContent() != null ? post.getContent() : "";
            String excerpt = content.length() > 100 ? content.substring(0, 100) + "..." : content;
            post.setExcerpt(excerpt);
        }

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
