//package alura.blog.dominio.usuario;
//
//import java.util.Set;
//import java.util.stream.Collectors;
//
//public record DatosDetalleUsuario(
//        Long id,
//        String fullName,
//        String email,
//        Boolean enabled,
//        Set<String> roles
//) {
//    public DatosDetalleUsuario(User user) {
//        this(
//                user.getId(),
//                user.getFullName(),
//                user.getEmail(),
//                user.getEnabled(),
//                user.getRoles()
//                        .stream()
//                        .map(Enum::name)
//                        .collect(Collectors.toSet())
//        );
//    }
//}
package alura.blog.dominio.usuario;

import java.util.Set;
import java.util.stream.Collectors;

public record DatosDetalleUsuario(
        Long id,
        String fullName,
        String email,
        Boolean enabled,
        Set<String> roles
) {
    public DatosDetalleUsuario(User user) {
        this(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getEnabled(),
                user.getRoles().stream()
                        .map(Role::name) // sin ROLE_ para front
                        .collect(Collectors.toSet())
        );
    }
}

