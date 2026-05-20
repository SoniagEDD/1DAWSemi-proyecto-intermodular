package pmo.daw.semi.model.service.base;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import pmo.daw.semi.excepciones.ServiceException;
import pmo.daw.semi.transactionmanager.TransactionManager;
import pmo.daw.semi.transactionmanager.TransactionalOperation;

public abstract class BaseService<E, ID> implements IBaseService<E, ID> {
	private TransactionManager tm = TransactionManager.getInstance();

	protected Connection getConnection() throws SQLException {
		return tm.getDatasource().getConnection();
	}

	protected <R> R ejecutarTransaccion(TransactionalOperation<R> operation) throws ServiceException {
		return tm.execute(operation);
	}

	public List<E> findAll() throws ServiceException {
		return tm.execute(new TransactionalOperation<List<E>>() {
			@Override
			public List<E> execute(Connection conexion) throws ServiceException {
				return findAll(conexion);
			}
		});
	}

	public E findById(ID id) throws ServiceException {
		return tm.execute(new TransactionalOperation<E>() {
			@Override
			public E execute(Connection conexion) throws ServiceException {
				return findById(conexion, id);
			}
		});
	}

	public E save(E entity) throws ServiceException {
		return tm.execute(new TransactionalOperation<E>() {
			@Override
			public E execute(Connection conexion) throws ServiceException {
				return save(conexion, entity);
			}
		});
	}

	public E update(ID id, E entity) throws ServiceException {
		return tm.execute(new TransactionalOperation<E>() {
			@Override
			public E execute(Connection conexion) throws ServiceException {
				return update(conexion, id, entity);
			}
		});
	}

	public void deleteById(ID id) throws ServiceException {
		tm.execute(new TransactionalOperation<Void>() {
			@Override
			public Void execute(Connection conexion) throws ServiceException {
				deleteById(conexion, id);
				return null;
			}
		});
	}
}