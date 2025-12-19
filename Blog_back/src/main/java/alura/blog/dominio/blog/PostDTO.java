package alura.blog.dominio.blog;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

//@Getter
//@AllArgsConstructor
//public class PostDTO {
//    private Long id;
//    private String title;
//    private String excerpt;
//    private String mensaje;
//    private String category;
//    private String imageUrl;
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
//    private Boolean activo;
//    private Long authorId;
//    private String authorName;
//    private PostStatus status;
//
//    // Método para convertir Post → PostDTO
//    public static PostDTO fromPost(Post post) {
//        Long authorId = post.getAuthor() != null ? post.getAuthor().getId() : null;
//        String authorName = post.getAuthor() != null ? post.getAuthor().getFullName() : "Desconocido";
//        return new PostDTO(
//                post.getId(),
//                post.getTitle(),
//                post.getExcerpt(),
//                post.getMensaje(),
//                post.getCategory() != null ? post.getCategory().getName() : "General",
//                post.getImageUrl(),
//                post.getCreatedAt(),
//                post.getUpdatedAt(),
//                post.getActivo(),
//                authorId,
//                authorName,
//                post.getStatus()
//        );
//    }
//}

@Getter
@AllArgsConstructor
public class PostDTO {

    private Long id;
    private String title;
    private String excerpt;
    private String mensaje;

    private Long categoryId;      // ← para editar
    private String categoryName;  // ← para mostrar

    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean activo;

    private Long authorId;
    private String authorName;

    private PostStatus status;

    public static PostDTO fromPost(Post post) {
        return new PostDTO(
                post.getId(),
                post.getTitle(),
                post.getExcerpt(),
                post.getMensaje(),

                post.getCategory() != null ? post.getCategory().getId() : null,
                post.getCategory() != null ? post.getCategory().getName() : "General",

                post.getImageUrl(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getActivo(),

                post.getAuthor() != null ? post.getAuthor().getId() : null,
                post.getAuthor() != null ? post.getAuthor().getFullName() : "Desconocido",

                post.getStatus()
        );
    }
}

