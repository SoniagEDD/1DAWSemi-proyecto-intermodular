package pmo.daw.semi.transactionmanager;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import pmo.daw.semi.excepciones.RepositoryException;
import pmo.daw.semi.excepciones.ServiceException;
import pmo.daw.semi.excepciones.TransactionManagerException;

public class TransactionManager {
	// Eager Singleton (JNA-style)
	private static final TransactionManager INSTANCE = new TransactionManager();
	private TransactionManager() {}
	public static TransactionManager getInstance() {
		return INSTANCE;
	}
	// Fin del Eager Singleton

	private DataSource dataSource;

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	public DataSource getDatasource() {
		return dataSource;
	}

	public <T> T execute(TransactionalOperation<T> operation) throws ServiceException {
		try (Connection conn = dataSource.getConnection()) {
			conn.setAutoCommit(false); // Desactiva commits automáticos
			try {
				T result = operation.execute(conn);
				conn.commit(); // Confirma todos los cambios si todo sale bien
				return result;
			} catch (RepositoryException repositoryException) {
				// Error al ejecutar alguna query
				try {
					conn.rollback(); // Revertir los cambios
				} catch (SQLException exRollback) {
					// Error al hacer roolback
					//exRollback.printStackTrace();
					throw new TransactionManagerException("Error ejecuando el rollback", exRollback);
				}
				//repositoryException.printStackTrace();
				throw repositoryException;
			}
		} catch (SQLException sqlException) {
			// Error al obtener o cerrar la conexión
			//exConn.printStackTrace();
			throw new TransactionManagerException("Fallo obteniendo la conexion", sqlException);
		}
	}
}
