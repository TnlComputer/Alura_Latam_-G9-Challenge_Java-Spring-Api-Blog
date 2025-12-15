package alura.blog.controller;

import alura.blog.dominio.usuario.DatosAdminUsuario;
import alura.blog.dominio.usuario.User;
import alura.blog.dominio.usuario.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER')")
    public ResponseEntity<List<User>> listarUsuarios() {
        return ResponseEntity.ok(userService.listarUsuarios());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER')")
    public ResponseEntity<User> crearUsuario(@RequestBody DatosAdminUsuario datos) {
        return ResponseEntity.ok(userService.crearUsuarioAdmin(datos));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<User> actualizarUsuario(@PathVariable Long id, @RequestBody DatosAdminUsuario datos) {
        return ResponseEntity.ok(userService.actualizarUsuarioAdmin(id, datos));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        userService.eliminarUsuarioAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
