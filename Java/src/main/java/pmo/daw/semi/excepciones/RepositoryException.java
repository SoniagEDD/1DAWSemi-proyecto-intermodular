package pmo.daw.semi.excepciones;

public class RepositoryException extends TransactionManagerException {
	private static final long serialVersionUID = 1L;

	public RepositoryException(String string, Exception e) {
		super(string, e);
	}

	public RepositoryException(String string) {
		super(string);
	}
}