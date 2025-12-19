//package alura.blog.dominio.usuario;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//import java.util.Set;
//
//@Entity
//@Table(name = "users")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@EqualsAndHashCode(of = "id")
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "full_name")
//    private String fullName;
//
//    @Column(unique = true, nullable = false)
//    private String email;
//
//    private String password;
//
//    private Boolean enabled = true;
//
//    @ElementCollection(fetch = FetchType.EAGER)
//    @CollectionTable(
//            name = "user_roles",
//            joinColumns = @JoinColumn(name = "user_id")
//    )
//    @Enumerated(EnumType.STRING)
//    @Column(name = "role")
//    private Set<Role> roles;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @Column(name = "updated_at")
//    private LocalDateTime updatedAt;
//
//    @PrePersist
//    void onCreate() {
//        createdAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    void onUpdate() {
//        updatedAt = LocalDateTime.now();
//    }
//}

package alura.blog.dominio.usuario;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    private String email;

    private String password;

    private Boolean enabled = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Set<Role> roles;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
