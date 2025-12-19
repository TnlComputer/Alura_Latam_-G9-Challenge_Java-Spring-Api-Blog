package alura.blog.dominio.blog;

import jakarta.validation.constraints.NotBlank;

public record DatosRegistroPost(
        @NotBlank(message = "El título es obligatorio") String title,
//        String content,
        @NotBlank(message = "El mensaje es obligatorio") String mensaje,
        String imageUrl,
        Long categoryId // puede ser null
) { }
