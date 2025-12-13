package alura.blog.dominio.blog;

import jakarta.validation.constraints.NotNull;

public record DatosActualizarPost(
        @NotNull
        Long id,
        String mensaje
) {
}