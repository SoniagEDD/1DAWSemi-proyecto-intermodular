package pmo.daw.semi.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pmo.daw.semi.controller.base.BaseController;
import pmo.daw.semi.model.entities.Reserva;
import pmo.daw.semi.model.service.ReservaService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/reserva")
public class ReservaController extends BaseController<Reserva, Integer> {

    @Override
    public ResponseEntity<List<Reserva>> findAll() {
        try {
            // Usamos la instancia Singleton igual que en Destinos
            List<Reserva> lista = ReservaService.getInstance().findAll();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<Reserva> save(@RequestBody Reserva entity) {
        try {
            Reserva guardada = ReservaService.getInstance().save(entity);
            return ResponseEntity.ok(guardada);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Método explícito para el borrado de reservas
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        try {
            ReservaService.getInstance().deleteById(null, id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}