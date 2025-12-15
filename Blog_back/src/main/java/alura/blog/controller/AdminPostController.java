package alura.blog.controller;

import alura.blog.dominio.blog.Post;
import alura.blog.dominio.blog.PostService;
import org.springframework.web.bind.annotation.*;
        import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/admin/posts")
public class AdminPostController {
    private final PostService postService;
    public AdminPostController(PostService postService){ this.postService = postService; }

    @PostMapping
    public ResponseEntity<Post> create(@RequestBody Post post){
        Post saved = postService.save(post);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @RequestBody Post payload){
        return postService.findById(id).map(existing -> {
            existing.setTitle(payload.getTitle());
            existing.setContent(payload.getContent());
            existing.setExcerpt(payload.getExcerpt());
            existing.setImageUrl(payload.getImageUrl());
            Post updated = postService.save(existing);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        postService.deleteById(id);
        return ResponseEntity.noContent().build(); // 204
    }
}
