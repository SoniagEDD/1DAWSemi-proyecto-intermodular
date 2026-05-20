package pmo.daw.semi.model.service;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import pmo.daw.semi.excepciones.ServiceException;
import pmo.daw.semi.model.entities.Destino;
import pmo.daw.semi.model.repository.DestinoRepository;
import pmo.daw.semi.model.service.base.BaseService;

@Service
public class DestinoService extends BaseService<Destino, Integer> {

    private static final DestinoService INSTANCE =
            new DestinoService();

    private DestinoService() {}

    public static DestinoService getInstance() {
        return INSTANCE;
    }

    private final DestinoRepository destinoRepository =
            DestinoRepository.getInstance();

    // =========================
    // MÉTODOS PARA CONTROLLER
    // =========================

    public List<Destino> findAll()
            throws ServiceException {

        List<Destino> lista = new ArrayList<>();

        try (Connection con = getConnection()) {

            if (con != null) {
                lista = destinoRepository.findAll(con);
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new ServiceException(
                    "Error al obtener destinos", e);
        }

        return lista;
    }

    public Destino findById(Integer id)
            throws ServiceException {

        try (Connection con = getConnection()) {

            return destinoRepository.findById(con, id);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error al buscar destino", e);
        }
    }

    public Destino save(Destino destino)
            throws ServiceException {

        try (Connection con = getConnection()) {

            return destinoRepository.save(con, destino);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error al guardar destino", e);
        }
    }

    public Destino update(Integer id,
                          Destino destino)
            throws ServiceException {

        try (Connection con = getConnection()) {

            return destinoRepository.update(
                    con,
                    id,
                    destino
            );

        } catch (Exception e) {

            throw new ServiceException(
                    "Error al actualizar destino", e);
        }
    }

    public void deleteById(Integer id)
            throws ServiceException {

        try (Connection con = getConnection()) {

            destinoRepository.deleteById(con, id);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error al eliminar destino", e);
        }
    }

    // =========================
    // MÉTODOS HEREDADOS
    // =========================

    @Override
    public List<Destino> findAll(Connection conexion)
            throws ServiceException {

        return destinoRepository.findAll(conexion);
    }

    @Override
    public Destino findById(Connection conexion,
                            Integer id)
            throws ServiceException {

        return destinoRepository.findById(
                conexion,
                id
        );
    }

    @Override
    public Destino save(Connection conexion,
                        Destino destino)
            throws ServiceException {

        return destinoRepository.save(
                conexion,
                destino
        );
    }

    @Override
    public Destino update(Connection conexion,
                          Integer id,
                          Destino destino)
            throws ServiceException {

        return destinoRepository.update(
                conexion,
                id,
                destino
        );
    }

    @Override
    public void deleteById(Connection conexion,
                           Integer id)
            throws ServiceException {

        destinoRepository.deleteById(
                conexion,
                id
        );
    }
}