package alura.blog.dominio.blog;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Table(name = "posteos")
@Entity(name = "Post")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean activo;
    private String mensaje;

    @NotBlank
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String excerpt;

    private String imageUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public Post(DatosRegistroPost datos){
        this.id = null;
        this.activo = true;
        this.mensaje = datos.mensaje();
    }

//    public Post(DatosRegistroPost datos) {
//        this.id = null;
//        this.activo = true;
//        this.mensaje = datos.mensaje();

    public void eliminar() {
        this.activo = false;
    }
}
