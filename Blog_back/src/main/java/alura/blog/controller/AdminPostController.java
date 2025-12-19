package alura.blog.controller;

import alura.blog.dominio.blog.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
public class AdminPostController {

    private final PostService postService;

    // -----------------------------
    // LISTAR POSTS (activos e inactivos) con filtros opcionales
    // -----------------------------

    @GetMapping
    public ResponseEntity<Page<PostDTO>> listar(
            @RequestParam(required = false) Long authorId,
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        Page<Post> posts = postService.findPostsFiltered(authorId, categoryId, null, pageable);

        Page<PostDTO> dtoPage = posts.map(PostDTO::fromPost);

        return ResponseEntity.ok(dtoPage);
    }


    // -----------------------------
    // CREAR POST
    // -----------------------------
    @PostMapping
    public ResponseEntity<Post> create(@RequestBody Post post){
        Post saved = postService.save(post);
        return ResponseEntity.ok(saved);
    }

    // -----------------------------
    // EDIT POST
    // -----------------------------
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> obtenerPost(@PathVariable Long id) {
        Post post = postService.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));
        return ResponseEntity.ok(PostDTO.fromPost(post));
    }


    // -----------------------------
    // ACTUALIZAR POST
    // -----------------------------
//    @PutMapping("/{id}")
//    public ResponseEntity<Post> update(@PathVariable Long id, @RequestBody Post payload){
//        return postService.findById(id).map(existing -> {
//            existing.setTitle(payload.getTitle());
//            existing.setMensaje(payload.getMensaje());
//            existing.setExcerpt(payload.getExcerpt());
//            existing.setImageUrl(payload.getImageUrl());
//            existing.setActivo(payload.isActivo()); // permitir actualizar activo
//            Post updated = postService.save(existing);
//            return ResponseEntity.ok(updated);
//        }).orElse(ResponseEntity.notFound().build());
//    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> update(
            @PathVariable Long id,
            @RequestBody DatosRegistroPost datos
    ) {
        Post post = postService.actualizar(id, datos);
        return ResponseEntity.ok(PostDTO.fromPost(post));
    }

    // -----------------------------
    // ELIMINAR POST (solo marcar como inactivo)
    // -----------------------------
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id){
//        postService.findById(id).ifPresent(p -> {
//            p.setActivo(false); // marcar como inactivo
//            postService.save(p);
//        });
//        return ResponseEntity.noContent().build(); // 204
//    }
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
//        postService.eliminar(id);
//        return ResponseEntity.noContent().build();
//    }
    @PatchMapping("/{id}")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        return postService.findById(id).map(post -> {

            Boolean activo = (Boolean) payload.get("activo");
            String status = (String) payload.get("status");

            if (activo != null) post.setActivo(activo);
            if (status != null) post.setStatus(PostStatus.valueOf(status));

            post.setUpdatedAt(LocalDateTime.now());
            postService.save(post);

            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }



}
