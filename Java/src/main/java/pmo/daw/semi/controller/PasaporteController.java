package pmo.daw.semi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pmo.daw.semi.excepciones.ServiceException;
import pmo.daw.semi.model.entities.Pasaporte;
import pmo.daw.semi.model.service.PasaporteService;

@RestController
@RequestMapping("/api/pasaporte")
@CrossOrigin(origins = "*", allowedHeaders = "*")

public class PasaporteController {

    @Autowired
    private PasaporteService service;

    @GetMapping
    public ResponseEntity<List<Pasaporte>> findAll()
            throws ServiceException {

        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pasaporte> findById(
            @PathVariable Integer id)
            throws ServiceException {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Pasaporte> save(
            @RequestBody Pasaporte p)
            throws ServiceException {

        return ResponseEntity.ok(
                service.save(p)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pasaporte> update(
            @PathVariable Integer id,
            @RequestBody Pasaporte p)
            throws ServiceException {

        return ResponseEntity.ok(
                service.update(id, p)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(
            @PathVariable Integer id)
            throws ServiceException {

        service.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}