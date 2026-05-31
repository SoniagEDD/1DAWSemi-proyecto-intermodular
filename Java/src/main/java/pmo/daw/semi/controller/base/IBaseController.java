package pmo.daw.semi.controller.base;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

public interface IBaseController<E, ID> {

    @GetMapping
    ResponseEntity<List<E>> findAll();

    @GetMapping("/{id}")
    ResponseEntity<E> findById(@PathVariable ID id);

    @PostMapping
    ResponseEntity<E> save(@RequestBody E entity);

    @PutMapping("/{id}")
    ResponseEntity<E> update(@PathVariable ID id,
                             @RequestBody E entity);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteById(@PathVariable ID id);
}