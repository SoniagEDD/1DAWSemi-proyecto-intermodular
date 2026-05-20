package pmo.daw.semi.model.service;

import java.sql.Connection;
import java.util.List;

import pmo.daw.semi.excepciones.ServiceException;
import pmo.daw.semi.model.entities.Guia;
import pmo.daw.semi.model.repository.GuiaRepository;
import pmo.daw.semi.model.service.base.BaseService;

public class GuiaService extends BaseService<Guia, Integer> {

    // =========================================
    // Singleton
    // =========================================
    private static final GuiaService INSTANCE = new GuiaService();

    private GuiaService() {}

    public static GuiaService getInstance() {
        return INSTANCE;
    }

    // =========================================
    // Repository
    // =========================================
    private final GuiaRepository guiaRepository =
            GuiaRepository.getInstance();

    // =========================================
    // FIND ALL
    // =========================================
    @Override
    public List<Guia> findAll(Connection conexion)
            throws ServiceException {

        try {

            return guiaRepository.findAll(conexion);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error al buscar guías", e);
        }
    }

    // =========================================
    // FIND BY ID
    // =========================================
    @Override
    public Guia findById(Connection conexion,
                         Integer id)
            throws ServiceException {

        try {

            if (id == null) {

                throw new ServiceException(
                        "id no puede ser null");
            }

            Guia guia =
                    guiaRepository.findById(conexion, id);

            if (guia == null) {

                throw new ServiceException(
                        "guía no encontrada");
            }

            return guia;

        } catch (Exception e) {

            throw new ServiceException(
                    "Error al buscar guía", e);
        }
    }

    // =========================================
    // SAVE
    // =========================================
    @Override
    public Guia save(Connection conexion,
                      Guia guia)
            throws ServiceException {

        try {

            if (guia == null) {

                throw new ServiceException(
                        "guia no puede ser null");
            }

            return guiaRepository.save(conexion, guia);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error al guardar guía", e);
        }
    }

    // =========================================
    // UPDATE
    // =========================================
    @Override
    public Guia update(Connection conexion,
                        Integer id,
                        Guia guia)
            throws ServiceException {

        try {

            if (id == null) {

                throw new ServiceException(
                        "id no puede ser null");
            }

            if (guia == null) {

                throw new ServiceException(
                        "guia no puede ser null");
            }

            Guia existente =
                    guiaRepository.findById(conexion, id);

            if (existente == null) {

                throw new ServiceException(
                        "guía no encontrada");
            }

            return guiaRepository.update(
                    conexion,
                    id,
                    guia);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error al actualizar guía", e);
        }
    }

    // =========================================
    // DELETE
    // =========================================
    @Override
    public void deleteById(Connection conexion,
                           Integer id)
            throws ServiceException {

        try {

            if (id == null) {

                throw new ServiceException(
                        "id no puede ser null");
            }

            Guia existente =
                    guiaRepository.findById(conexion, id);

            if (existente == null) {

                throw new ServiceException(
                        "guía no encontrada");
            }

            guiaRepository.deleteById(conexion, id);

        } catch (Exception e) {

            throw new ServiceException(
                    "Error al eliminar guía", e);
        }
    }
}