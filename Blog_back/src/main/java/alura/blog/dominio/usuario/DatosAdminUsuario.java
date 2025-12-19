//package alura.blog.dominio.usuario;
//
//import java.util.Set;
//
//public record DatosAdminUsuario(
//        String fullName,
//        String email,
//        String password,   // opcional
//        Boolean enabled,
//        Set<String> roles
//) {}
package alura.blog.dominio.usuario;

import java.util.Set;

public record DatosAdminUsuario(
        String fullName,
        String email,
        String password,
        Boolean enabled,
        Set<String> roles
) {}

