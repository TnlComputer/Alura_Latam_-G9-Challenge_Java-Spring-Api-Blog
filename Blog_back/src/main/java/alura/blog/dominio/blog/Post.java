package alura.blog.dominio.blog;

import alura.blog.dominio.usuario.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity(name = "Post")
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean activo = true;

    private String mensaje;

    @NotBlank
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String excerpt;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ---------------------------
    // Relación ManyToOne con User
    // ---------------------------
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User author;

    // ---------------------------
    // Constructor con DatosRegistroPost
    // ---------------------------
    public Post(DatosRegistroPost datos){
        this.title = datos.title();
        this.content = datos.content();
        this.excerpt = generarExcerpt(datos.content());
        this.mensaje = datos.mensaje();
        this.imageUrl = datos.imageUrl();
        this.category = datos.category() != null ? datos.category() : "general";
        this.activo = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    private String generarExcerpt(String content) {
        if (content == null) return "";
        return content.length() > 100 ? content.substring(0, 100) + "..." : content;
    }

    public void eliminar() {
        this.activo = false;
    }
}

