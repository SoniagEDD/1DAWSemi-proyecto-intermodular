package pmo.daw.semi.excepciones;

public class TransactionManagerException extends ServiceException {
	private static final long serialVersionUID = 1L;

	public TransactionManagerException(String string, Exception e) {
		super(string, e);
	}

	public TransactionManagerException(String string) {
		super(string);
	}
}