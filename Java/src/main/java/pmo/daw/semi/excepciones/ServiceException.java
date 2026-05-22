package pmo.daw.semi.excepciones;

public class ServiceException extends Exception {
	private static final long serialVersionUID = 1L;

	public ServiceException(String string, Exception e) {
		super(string, e);
	}

	public ServiceException(String string) {
		super(string);
	}
}