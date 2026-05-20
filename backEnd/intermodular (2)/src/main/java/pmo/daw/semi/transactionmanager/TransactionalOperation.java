package pmo.daw.semi.transactionmanager;

import java.sql.Connection;

import pmo.daw.semi.excepciones.ServiceException;

@FunctionalInterface
public interface TransactionalOperation<T> {
    T execute(Connection conn) throws ServiceException;
}
