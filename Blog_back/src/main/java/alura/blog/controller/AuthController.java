package alura.blog.controller;

import alura.blog.dominio.usuario.DatosLoginUsuario;
import alura.blog.dominio.usuario.DatosRegistroUsuario;
import alura.blog.dominio.usuario.UserService;
import alura.blog.infra.security.DatosJWTToken;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
