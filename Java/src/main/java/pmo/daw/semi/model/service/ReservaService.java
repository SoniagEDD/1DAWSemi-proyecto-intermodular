package pmo.daw.semi.model.service;

import java.sql.Connection;
import java.util.List;
import org.springframework.stereotype.Service; // Import necesario para @Service

import pmo.daw.semi.excepciones.ServiceException;
import pmo.daw.semi.model.entities.Destino;
import pmo.daw.semi.model.entities.Reserva;
import pmo.daw.semi.model.entities.Usuario;
import pmo.daw.semi.model.repository.ReservaRepository;
import pmo.daw.semi.model.service.base.BaseService;

@Service
public class ReservaService extends BaseService<Reserva, Integer> {
    
    private static final ReservaService INSTANCE = new ReservaService();
    private ReservaService() {}
    public static ReservaService getInstance() {
        return INSTANCE;
    }

    private final ReservaRepository reservaRepository = ReservaRepository.getInstance();


    @Override
    public List<Reserva> findAll(Connection conexion) throws ServiceException {
        // 1. Traemos la lista básica de reservas de la base de datos
        List<Reserva> reservas = reservaRepository.findAll(conexion);
        
        // 2. Obtenemos las instancias de los servicios para buscar los nombres
        UsuarioService usuarioService = UsuarioService.getInstance();
        DestinoService destinoService = DestinoService.getInstance();

        // 3. Recorremos cada reserva y le asociamos su usuario y destino reales
        if (reservas != null) {
            for (Reserva r : reservas) {
                try {
                    if (r.getIdUsuario() != null) {
                        r.setUsuario(usuarioService.findById(conexion, r.getIdUsuario()));
                    }
                    if (r.getIdDestino() != null) {
                        r.setDestino(destinoService.findById(conexion, r.getIdDestino()));
                    }
                } catch (Exception e) {
                    // Si una reserva falla, evitamos que rompa todo el listado completo
                    System.out.println("Error al rellenar relaciones de la reserva: " + e.getMessage());
                }
            }
        }
        return reservas;
    }

    @Override
    public Reserva findById(Connection conexion, Integer id) throws ServiceException {
        // 1. Buscamos la reserva por ID
        Reserva r = reservaRepository.findById(conexion, id);
        
        // 2. Si existe, le rellenamos sus objetos correspondientes
        if (r != null) {
            UsuarioService usuarioService = UsuarioService.getInstance();
            DestinoService destinoService = DestinoService.getInstance();
            
            if (r.getIdUsuario() != null) {
                r.setUsuario(usuarioService.findById(conexion, r.getIdUsuario()));
            }
            if (r.getIdDestino() != null) {
                r.setDestino(destinoService.findById(conexion, r.getIdDestino()));
            }
        }
        return r;
    }

    @Override
    public Reserva save(Connection conexion, Reserva reserva)
            throws ServiceException {

        UsuarioService usuarioService =
                UsuarioService.getInstance();

        DestinoService destinoService =
                DestinoService.getInstance();

        // Buscar usuario
        Usuario usuario = usuarioService.findById(
                conexion,
                reserva.getIdUsuario());

        // Buscar destino
        Destino destino = destinoService.findById(
                conexion,
                reserva.getIdDestino());

        // VALIDACIÓN PASAPORTE
        if (destino.getRequierePasaporte()
                && usuario.getPasaporte() == null) {

            throw new ServiceException(
                    "Este destino requiere pasaporte");
        }

        // Guardar reserva
        return reservaRepository.save(
                conexion,
                reserva);
    }

    @Override
    public Reserva update(Connection conexion, Integer id, Reserva reserva) throws ServiceException {
        return reservaRepository.update(conexion, id, reserva);
    }

    @Override
    public void deleteById(Connection conexion, Integer id) throws ServiceException {
        reservaRepository.deleteById(conexion, id);
    }
}