package alura.blog.dominio.category;

import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public Optional<Category> findById(Long id) {
        return repository.findById(id);
    }

    public Optional<Category> findByName(String name) {
        return repository.findByName(name);
    }

    public Category save(Category category) {
        return repository.save(category);
    }
}
