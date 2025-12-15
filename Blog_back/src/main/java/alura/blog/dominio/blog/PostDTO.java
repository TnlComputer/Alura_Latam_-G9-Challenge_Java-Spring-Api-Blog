package alura.blog.dominio.blog;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PostDTO {
    private Long id;
    private String title;
    private String excerpt;
    private String content;
    private String category;
    private String imageUrl;
    private LocalDateTime createdAt;
    private String authorName;

    // Método para convertir Post → PostDTO
    public static PostDTO fromPost(Post post) {
        String authorName = post.getAuthor() != null ? post.getAuthor().getFullName() : "Desconocido";
        return new PostDTO(
                post.getId(),
                post.getTitle(),
                post.getExcerpt(),
                post.getContent(),
                post.getCategory().getName(),
                post.getImageUrl(),
                post.getCreatedAt(),
                authorName
        );
    }
}
