package alura.blog.dominio.blog;

import jakarta.validation.constraints.NotBlank;

public record DatosRegistroPost(

        @NotBlank(message = "mensaje no puede esta sin texto, es obligatorio") String mensaje) {
}
