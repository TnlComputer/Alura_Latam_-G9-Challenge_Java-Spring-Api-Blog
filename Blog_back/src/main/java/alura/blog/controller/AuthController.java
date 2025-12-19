package alura.blog.controller;

import alura.blog.dominio.usuario.*;
import alura.blog.infra.security.DatosJWTToken;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @RequestBody @Valid DatosRegistroUsuario datos
    ) {
        userService.register(datos);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<DatosJWTToken> login(
            @RequestBody @Valid DatosLoginUsuario datos
    ) {

        String token = userService.login(datos);
        return ResponseEntity.ok(new DatosJWTToken(token));
    }

    @GetMapping("/me")
    public ResponseEntity<DatosDetalleUsuario> getCurrentUser(@AuthenticationPrincipal String email) {
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User user = userService.findByEmail(email);
        return ResponseEntity.ok(new DatosDetalleUsuario(user));
    }

}
