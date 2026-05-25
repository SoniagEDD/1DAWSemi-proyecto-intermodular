package pmo.daw.semi.model.service.base;

import java.sql.Connection;
import java.util.List;

import pmo.daw.semi.excepciones.ServiceException;

public interface IBaseService<E, ID> {
    List<E> findAll(Connection conexion) throws ServiceException;
    E findById(Connection conexion, ID id) throws ServiceException;
    E save(Connection conexion, E entity) throws ServiceException;
    E update(Connection conexion, ID id, E entity) throws ServiceException;
    void deleteById(Connection conexion, ID id) throws ServiceException;
}
