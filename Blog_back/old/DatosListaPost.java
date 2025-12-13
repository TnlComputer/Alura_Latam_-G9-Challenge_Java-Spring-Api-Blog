package alura.blog.dominio.blog;

import jakarta.validation.constraints.NotNull;

public record DatosListaPost(
        @NotNull Long id,
        String mensaje
) {
    public DatosListaPost(Post post){
        this(
                post.getId(),
                post.getMensaje()
        );
    }
}
