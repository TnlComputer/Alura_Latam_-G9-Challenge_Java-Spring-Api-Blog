package alura.blog.dominio.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DatosRegistroUsuario(

        @NotBlank
        String fullName,

        @NotBlank
        @Email
        String email,

        @NotBlank
        String password
) {}

