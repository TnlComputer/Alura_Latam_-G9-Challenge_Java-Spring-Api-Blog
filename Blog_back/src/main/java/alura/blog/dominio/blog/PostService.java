package alura.blog.dominio.blog;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository repo;
    public PostService(PostRepository repo){ this.repo = repo; }

    public List<Post> findAll(){ return repo.findAll(); }

    public Optional<Post> findById(Long id){ return repo.findById(id); }

    public Post save(Post post){ return repo.save(post); }

    public void deleteById(Long id){ repo.deleteById(id); }
}