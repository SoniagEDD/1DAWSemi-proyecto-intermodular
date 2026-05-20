package pmo.daw.semi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pmo.daw.semi.excepciones.ServiceException;
import pmo.daw.semi.model.entities.Destino;
import pmo.daw.semi.model.service.DestinoService;

@CrossOrigin(origins = "*", allowedHeaders = "*") // <-- ESTA LÍNEA ES OBLIGATORIA
@RestController
@RequestMapping("/api/destino")

public class DestinoController {

    @Autowired
    private DestinoService service;

    // LISTAR TODOS
    @GetMapping
    public ResponseEntity<List<Destino>> findAll()
            throws ServiceException {

        return ResponseEntity.ok(
                service.findAll()
        );
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Destino> findById(
            @PathVariable Integer id)
            throws ServiceException {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    // CREAR
    @PostMapping
    public ResponseEntity<Destino> save(
            @RequestBody Destino destino)
            throws ServiceException {

        return ResponseEntity.ok(
                service.save(destino)
        );
    }

    // MODIFICAR
    @PutMapping("/{id}")
    public ResponseEntity<Destino> update(
            @PathVariable Integer id,
            @RequestBody Destino destino)
            throws ServiceException {

        return ResponseEntity.ok(
                service.update(id, destino)
        );
    }

    // ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(
            @PathVariable Integer id)
            throws ServiceException {

        service.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}