package pmo.daw.semi.model.service;

import java.sql.Connection;
import java.util.List;

import org.springframework.stereotype.Service;

import pmo.daw.semi.excepciones.ServiceException;
import pmo.daw.semi.model.entities.Pasaporte;
import pmo.daw.semi.model.repository.PasaporteRepository;
import pmo.daw.semi.model.service.base.BaseService;

@Service
public class PasaporteService
        extends BaseService<Pasaporte, Integer> {

    // =========================================
    // Singleton
    // =========================================
    private static final PasaporteService INSTANCE =
            new PasaporteService();

    public static PasaporteService getInstance() {
        return INSTANCE;
    }

    // =========================================
    // Repository
    // =========================================
    private final PasaporteRepository repository =
            PasaporteRepository.getInstance();

    // =========================================
    // MÉTODOS NORMALES
    // =========================================

    public List<Pasaporte> findAll()
            throws ServiceException {

        try (Connection con = getConnection()) {

            return repository.findAll(con);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error obteniendo pasaportes", e);
        }
    }

    public Pasaporte findById(Integer id)
            throws ServiceException {

        try (Connection con = getConnection()) {

            return repository.findById(con, id);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error buscando pasaporte", e);
        }
    }

    public Pasaporte save(Pasaporte p)
            throws ServiceException {

        try (Connection con = getConnection()) {

            return repository.save(con, p);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error guardando pasaporte", e);
        }
    }

    public Pasaporte update(Integer id,
                            Pasaporte p)
            throws ServiceException {

        try (Connection con = getConnection()) {

            return repository.update(con, id, p);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error modificando pasaporte", e);
        }
    }

    public void deleteById(Integer id)
            throws ServiceException {

        try (Connection con = getConnection()) {

            repository.deleteById(con, id);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error eliminando pasaporte", e);
        }
    }

    // =========================================
    // MÉTODO NUEVO
    // =========================================

    public Pasaporte findByIdUsuario(
            Connection conexion,
            Integer idUsuario)
            throws ServiceException {

        try {

            return repository.findByIdUsuario(
                    conexion,
                    idUsuario);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error buscando pasaporte por usuario",
                    e);
        }
    }

    // =========================================
    // OVERRIDES BASESERVICE
    // =========================================

    @Override
    public List<Pasaporte> findAll(Connection conexion)
            throws ServiceException {

        return repository.findAll(conexion);
    }

    @Override
    public Pasaporte findById(Connection conexion,
                              Integer id)
            throws ServiceException {

        return repository.findById(conexion, id);
    }

    @Override
    public Pasaporte save(Connection conexion,
                          Pasaporte entity)
            throws ServiceException {

        return repository.save(conexion, entity);
    }

    @Override
    public Pasaporte update(Connection conexion,
                            Integer id,
                            Pasaporte entity)
            throws ServiceException {

        return repository.update(conexion, id, entity);
    }

    @Override
    public void deleteById(Connection conexion,
                           Integer id)
            throws ServiceException {

        repository.deleteById(conexion, id);
    }
}