package pmo.daw.semi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pmo.daw.semi.excepciones.ServiceException;
import pmo.daw.semi.model.entities.Guia;
import pmo.daw.semi.model.service.GuiaService;

@RestController
@RequestMapping("/api/guia")
@CrossOrigin(origins = "*", allowedHeaders = "*")

public class GuiaController {

    private final GuiaService service = GuiaService.getInstance();

    @GetMapping
    public ResponseEntity<List<Guia>> findAll() {

        try {

            return ResponseEntity.ok(service.findAll());

        } catch (ServiceException e) {

            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guia> findById(@PathVariable Integer id) {

        try {

            return ResponseEntity.ok(service.findById(id));

        } catch (ServiceException e) {

            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Guia> save(@RequestBody Guia guia) {

        try {

            return ResponseEntity.ok(service.save(guia));

        } catch (ServiceException e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Guia> update(@PathVariable Integer id,
                                       @RequestBody Guia guia) {

        try {

            return ResponseEntity.ok(service.update(id, guia));

        } catch (ServiceException e) {

            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {

        try {

            service.deleteById(id);

            return ResponseEntity.noContent().build();

        } catch (ServiceException e) {

            return ResponseEntity.internalServerError().build();
        }
    }
}