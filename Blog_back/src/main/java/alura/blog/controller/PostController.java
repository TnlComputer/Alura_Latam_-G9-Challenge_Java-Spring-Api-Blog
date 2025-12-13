package alura.blog.controller;

import alura.blog.dominio.blog.Post;
import alura.blog.dominio.blog.PostService;
import org.springframework.web.bind.annotation.*;
        import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService service;
    public PostController(PostService service){ this.service = service; }

    @GetMapping
    public List<Post> all(){ return service.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Post> get(@PathVariable Long id){
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // The following endpoints are protected in Security config (/api/admin/** could be used instead)
}
