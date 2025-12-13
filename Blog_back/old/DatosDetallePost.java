package alura.blog.dominio.blog;

public record DatosDetallePost(
        Long id,
        Boolean activo,
        String mensaje
) {
    public DatosDetallePost(Post post){
        this(
                post.getId(),
                post.getActivo(),
                post.getMensaje()
        );
    }
}
