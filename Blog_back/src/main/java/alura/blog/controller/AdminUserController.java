//package alura.blog.controller;
//
//import alura.blog.dominio.usuario.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.web.PageableDefault;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;

//@RestController
//@RequestMapping("/admin/users")
//@RequiredArgsConstructor
//public class AdminUserController {
//
//    private final UserService userService;
//
/// /    @GetMapping
/// /    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER')")
/// /    public ResponseEntity<List<User>> listarUsuarios() {
/// /        return ResponseEntity.ok(userService.listarUsuarios());
/// /    }
//
//    @GetMapping
//    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER')")
//    public ResponseEntity<Page<User>> listarUsuarios(
//            @PageableDefault(size = 10, sort = "id") Pageable pageable
//    ) {
//        return ResponseEntity.ok(userService.listarUsuarios(pageable));
//    }
//
//    @PostMapping
//    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER')")
//    public ResponseEntity<User> crearUsuario(
//            @RequestBody DatosAdminUsuario datos
//    ) {
//        return ResponseEntity.ok(userService.crearUsuarioAdmin(datos));
//    }
//
//
//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('SUPER')")
//    public ResponseEntity<User> actualizarUsuario(@PathVariable Long id, @RequestBody DatosAdminUsuario datos) {
//        return ResponseEntity.ok(userService.actualizarUsuarioAdmin(id, datos));
//    }
//
//    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('SUPER')")
//    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
//        userService.eliminarUsuarioAdmin(id);
//        return ResponseEntity.noContent().build();
//    }
//}


package alura.blog.controller;

import alura.blog.dominio.usuario.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    // -----------------------
    // LISTAR (PAGINADO)
    // -----------------------
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER')")
    public ResponseEntity<Page<DatosListadoUsuario>> listarUsuarios(
            @PageableDefault(size = 10, sort = "id") Pageable pageable
    ) {
        return ResponseEntity.ok(
                userService.listarUsuarios(pageable)
                        .map(DatosListadoUsuario::new)
        );
    }

    @GetMapping("/enabled")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER', 'USER')") // si quieres permitir cualquier usuario autenticado
    @CrossOrigin(origins = "http://127.0.0.1:5500") // para tu frontend
    public ResponseEntity<List<DatosListadoUsuario>> listarUsuariosHabilitados() {
        List<User> usuarios = userService.listarUsuariosHabilitados();
        List<DatosListadoUsuario> dtoList = usuarios.stream()
                .map(DatosListadoUsuario::new)
                .toList();
        return ResponseEntity.ok(dtoList);
    }


    // -----------------------
    // CREAR
    // -----------------------
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER')")
    public ResponseEntity<DatosDetalleUsuario> crearUsuario(
            @RequestBody DatosAdminUsuario datos
    ) {
        User user = userService.crearUsuarioAdmin(datos);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new DatosDetalleUsuario(user));
    }

    // -----------------------
    // ACTUALIZAR
    // -----------------------
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<DatosDetalleUsuario> actualizarUsuario(
            @PathVariable Long id,
            @RequestBody DatosAdminUsuario datos
    ) {
        User user = userService.actualizarUsuarioAdmin(id, datos);
        return ResponseEntity.ok(new DatosDetalleUsuario(user));
    }

    // -----------------------
    // ELIMINAR
    // -----------------------
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        userService.eliminarUsuarioAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
