package pmo.daw.semi.model.repository.base;

import java.sql.Connection;
import java.util.List;

import pmo.daw.semi.excepciones.RepositoryException;

public abstract class BaseRepository<E, ID> implements IBaseRepository<E, ID> {

	@Override
	public List<E> findAll(Connection conexion) throws RepositoryException {
		throw new RepositoryException("Repositorio no implementado");
	}

	@Override
	public E findById(Connection conexion, ID id) throws RepositoryException {
		throw new RepositoryException("Repositorio no implementado");
	}

	@Override
	public E save(Connection conexion, E entity) throws RepositoryException {
		throw new RepositoryException("Repositorio no implementado");
	}

	@Override
	public E update(Connection conexion, ID id, E entity) throws RepositoryException {
		throw new RepositoryException("Repositorio no implementado");
	}

	@Override
	public void deleteById(Connection conexion, ID id) throws RepositoryException {
		throw new RepositoryException("Repositorio no implementado");
	}
}