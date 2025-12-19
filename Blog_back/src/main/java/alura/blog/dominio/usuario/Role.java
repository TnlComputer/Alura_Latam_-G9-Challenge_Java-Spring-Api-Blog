package alura.blog.dominio.usuario;

public enum Role {
    USER,
    ADMIN,
    SUPER,
    COORDINATOR;

    // Para Spring Security
    public String asSpringRole() {
        return "ROLE_" + this.name();
    }
}


