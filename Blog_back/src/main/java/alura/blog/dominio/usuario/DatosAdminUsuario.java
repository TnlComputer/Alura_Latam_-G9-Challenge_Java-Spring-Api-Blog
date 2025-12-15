package alura.blog.dominio.usuario;

import java.util.Set;

public record DatosAdminUsuario(
        String fullName,
        String email,
        String password, // opcional, si se quiere cambiar
        Boolean enabled,
        Set<String> roles
) {}
