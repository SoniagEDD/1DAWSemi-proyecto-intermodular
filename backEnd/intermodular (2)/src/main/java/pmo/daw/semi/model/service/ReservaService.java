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
        return reservaRepository.findAll(conexion);
    }

    @Override
    public Reserva findById(Connection conexion, Integer id) throws ServiceException {
        return reservaRepository.findById(conexion, id);
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