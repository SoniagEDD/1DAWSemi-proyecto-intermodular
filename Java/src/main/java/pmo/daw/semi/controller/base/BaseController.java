package pmo.daw.semi.controller.base;

import java.util.List;

import org.springframework.http.ResponseEntity;

public abstract class BaseController<E, ID> implements IBaseController<E, ID> {

	@Override
	public ResponseEntity<List<E>> findAll() {
		throw new RuntimeException("EndPoint no implementado");
	}

	@Override
	public ResponseEntity<E> findById(ID id) {
		throw new RuntimeException("EndPoint no implementado");
	}

	@Override
	public ResponseEntity<E> save(E entity) {
		throw new RuntimeException("EndPoint no implementado");
	}
	
	@Override
	public ResponseEntity<E> update(ID id, E entity) {
		throw new RuntimeException("EndPoint no implementado");
	}

	@Override
	public ResponseEntity<Void> deleteById(ID id) {
		throw new RuntimeException("EndPoint no implementado");
	}
}
