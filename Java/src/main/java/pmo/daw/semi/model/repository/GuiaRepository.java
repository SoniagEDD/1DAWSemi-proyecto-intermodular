package pmo.daw.semi.model.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import pmo.daw.semi.excepciones.RepositoryException;
import pmo.daw.semi.model.entities.Guia;
import pmo.daw.semi.model.repository.base.BaseRepository;

public class GuiaRepository extends BaseRepository<Guia, Integer> {

	// Patrón Singleton idéntico al de tus otros repositorios
	private static final GuiaRepository INSTANCE = new GuiaRepository();
	private GuiaRepository() {}
	public static GuiaRepository getInstance() {
		return INSTANCE;
	}

	@Override
	public List<Guia> findAll(Connection conexion) throws RepositoryException {
		List<Guia> lista = new ArrayList<>();
		String sql = "SELECT id, nombre, apellidos, especialidad, id_destino FROM guia";
		
		try (Statement stmt = conexion.createStatement();
			 ResultSet rs = stmt.executeQuery(sql)) {
			
			while (rs.next()) {
				Guia g = new Guia();
				g.setId(rs.getInt("id"));
				g.setNombre(rs.getString("nombre"));
				g.setApellidos(rs.getString("apellidos"));
				g.setEspecialidad(rs.getString("especialidad"));
				
				// Gestionamos el idDestino por si viene como NULL en la base de datos
				int idDestino = rs.getInt("id_destino");
				if (!rs.wasNull()) {
					g.setIdDestino(idDestino);
				}
				
				lista.add(g);
			}
		} catch (SQLException e) {
			throw new RepositoryException("Error al consultar el listado de guías", e);
		}
		return lista;
	}

	@Override
	public Guia save(Connection conexion, Guia guia) throws RepositoryException {
		String sql = "INSERT INTO guia (nombre, apellidos, especialidad, id_destino) VALUES (?, ?, ?, ?)";
		
		try (PreparedStatement ps = conexion.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
			ps.setString(1, guia.getNombre());
			ps.setString(2, guia.getApellidos());
			ps.setString(3, guia.getEspecialidad());
			
			if (guia.getIdDestino() != null) {
				ps.setInt(4, guia.getIdDestino());
			} else {
				ps.setNull(4, java.sql.Types.INTEGER);
			}
			
			ps.executeUpdate();
			
			// Recuperamos el ID generado automáticamente por H2 para devolvérselo al objeto
			try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
				if (generatedKeys.next()) {
					guia.setId(generatedKeys.getInt(1));
				}
			}
		} catch (SQLException e) {
			throw new RepositoryException("Error al insertar el nuevo guía", e);
		}
		return guia;
	}

	@Override
	public Guia findById(Connection conexion, Integer id) throws RepositoryException {
		// Lo dejas vacío o retornando null si tu arquitectura no te obliga a rellenarlo aún
		return null;
	}

	@Override
	public Guia update(Connection conexion, Integer id, Guia guia) throws RepositoryException {
		return null;
	}

	@Override
	public void deleteById(Connection conexion, Integer id) throws RepositoryException {
		// Se ejecutará automáticamente desde la clase padre o puedes mapearlo si se requiere
	}
}