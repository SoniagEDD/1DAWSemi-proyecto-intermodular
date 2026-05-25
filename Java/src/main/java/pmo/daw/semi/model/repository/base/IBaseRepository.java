package pmo.daw.semi.model.repository.base;

import java.sql.Connection;
import java.util.List;

import pmo.daw.semi.excepciones.RepositoryException;

public interface IBaseRepository<E, ID> {
	List<E> findAll(Connection conexion) throws RepositoryException;
	E findById(Connection conexion, ID id) throws RepositoryException;
	E save(Connection conexion, E entity) throws RepositoryException;
	E update(Connection conexion, ID id, E entity) throws RepositoryException;
	void deleteById(Connection conexion, ID id) throws RepositoryException;
}