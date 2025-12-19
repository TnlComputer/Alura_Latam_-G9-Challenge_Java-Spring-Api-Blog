package alura.blog.controller;

import alura.blog.dominio.category.Category;
import alura.blog.dominio.category.CategoryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Permitir tu frontend
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> listAll() {
        List<Category> categories = categoryService.findAll();
        return ResponseEntity.ok(categories);
    }
}
