//package alura.blog.dominio.blog;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public interface PostRepository extends JpaRepository<Post, Long> {
//
//    // -------------------- QUERY PERSONALIZADA PARA FILTRADO --------------------
//    @Query("""
//        SELECT p FROM Post p
//        WHERE p.activo = true
//          AND (:authorId IS NULL OR p.author.id = :authorId)
//          AND (:category IS NULL OR p.category.name = :category)
//        ORDER BY p.createdAt DESC
//    """)
//    Page<Post> findAllActiveFiltered(
//            @Param("authorId") Long authorId,
//            @Param("category") String category,
//            Pageable pageable
//    );
//
//    // -------------------- POSTS ACTIVOS SIN FILTRO --------------------
//    @Query("SELECT p FROM Post p WHERE p.activo = true ORDER BY p.createdAt DESC")
//    Page<Post> findAllActive(Pageable pageable);
//
//}
package alura.blog.dominio.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p " +
            "WHERE (:authorId IS NULL OR p.author.id = :authorId) " +
            "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
            "AND (:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.mensaje) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY p.createdAt DESC")
    Page<Post> findAllFiltered(@Param("authorId") Long authorId,
                               @Param("categoryId") Long categoryId,
                               @Param("search") String search,
                               Pageable pageable);
}

