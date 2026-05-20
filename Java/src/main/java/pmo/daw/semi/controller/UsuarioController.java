package pmo.daw.semi.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.List;

import pmo.daw.semi.controller.base.BaseController;
import pmo.daw.semi.model.entities.Usuario;
import pmo.daw.semi.model.service.UsuarioService;

/**
 * Controlador REST para operaciones CRUD sobre la entidad Usuario.
 * Mapeado exclusivamente a /api/usuario y libre de errores de compilación.
 */
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/usuario")
public class UsuarioController extends BaseController<Usuario, Integer> {

    private final UsuarioService usuarioService = UsuarioService.getInstance();

    @Override
    public ResponseEntity<List<Usuario>> findAll() {
        try {
            List<Usuario> usuarios = usuarioService.findAll();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            // ESTO IMPRIMIRÁ EL ERROR REAL EN TU CONSOLA DE ECLIPSE
            e.printStackTrace(); 
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<Usuario> findById(Integer id) {
        try {
            Usuario usuario = usuarioService.findById(id);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<Usuario> save(Usuario usuario) {
        try {
            Usuario creado = usuarioService.save(usuario);
            return ResponseEntity.ok(creado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<Usuario> update(Integer id, Usuario usuario) {
        try {
            Usuario modificado = usuarioService.update(id, usuario);
            return ResponseEntity.ok(modificado); // CORREGIDO: Eliminada la errata de modmodified
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<Void> deleteById(Integer id) {
        try {
            usuarioService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}