//package alura.blog.dominio.usuario;
//
//import java.util.Set;
//import java.util.stream.Collectors;
//
//public record DatosListadoUsuario(
//        Long id,
//        String fullName,
//        String email,
//        Boolean enabled,
//        Set<String> roles
//) {
//    public DatosListadoUsuario(User user) {
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

public record DatosListadoUsuario(
        Long id,
        String fullName,
        String email,
        Boolean enabled,
        Set<String> roles
) {
    public DatosListadoUsuario(User user) {
        this(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getEnabled(),
                user.getRoles().stream()
                        .map(Role::name)
                        .collect(Collectors.toSet())
        );
    }
}

