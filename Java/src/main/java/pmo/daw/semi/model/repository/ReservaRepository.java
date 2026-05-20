package pmo.daw.semi.model.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import pmo.daw.semi.excepciones.RepositoryException;
import pmo.daw.semi.model.entities.Reserva;
import pmo.daw.semi.model.repository.base.BaseRepository;

public class ReservaRepository extends BaseRepository<Reserva, Integer> {
	
	private static final ReservaRepository INSTANCE = new ReservaRepository();
	private ReservaRepository() {}
	public static ReservaRepository getInstance() {
		return INSTANCE;
	}

	@Override
	public List<Reserva> findAll(Connection conexion) throws RepositoryException {
		List<Reserva> lista = new ArrayList<>();
		String sql = "SELECT id, id_usuario, id_destino, fecha_inicio, fecha_fin FROM reserva";
		
		try (PreparedStatement ps = conexion.prepareStatement(sql);
			 ResultSet rs = ps.executeQuery()) {
			
			while (rs.next()) {
				Reserva r = new Reserva(
					rs.getInt("id"),
					rs.getInt("id_usuario"),
					rs.getInt("id_destino"),
					rs.getString("fecha_inicio"),
					rs.getString("fecha_fin")
				);
				lista.add(r);
			}
		} catch (Exception e) {
			throw new RepositoryException("Error al listar todas las reservas", e);
		}
		return lista;
	}

	@Override
	public Reserva findById(Connection conexion, Integer id) throws RepositoryException {
		String sql = "SELECT id, id_usuario, id_destino, fecha_inicio, fecha_fin FROM reserva WHERE id = ?";
		try (PreparedStatement ps = conexion.prepareStatement(sql)) {
			ps.setInt(1, id);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					return new Reserva(
						rs.getInt("id"),
						rs.getInt("id_usuario"),
						rs.getInt("id_destino"),
						rs.getString("fecha_inicio"),
						rs.getString("fecha_fin")
					);
				}
			}
		} catch (Exception e) {
			throw new RepositoryException("Error al buscar reserva por ID", e);
		}
		return null;
	}

	@Override
	public Reserva save(Connection conexion, Reserva entity) throws RepositoryException {
		String sql = "INSERT INTO reserva (id_usuario, id_destino, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)";
		try (PreparedStatement ps = conexion.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {
			ps.setInt(1, entity.getIdUsuario());
			ps.setInt(2, entity.getIdDestino());
			ps.setString(3, entity.getFechaInicio());
			ps.setString(4, entity.getFechaFin());
			
			ps.executeUpdate();
			
			try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
				if (generatedKeys.next()) {
					entity.setId(generatedKeys.getInt(1));
				}
			}
			return entity;
		} catch (Exception e) {
			throw new RepositoryException("Error al guardar nueva reserva", e);
		}
	}

	@Override
	public Reserva update(Connection conexion, Integer id, Reserva entity) throws RepositoryException {
		String sql = "UPDATE reserva SET id_usuario = ?, id_destino = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?";
		try (PreparedStatement ps = conexion.prepareStatement(sql)) {
			ps.setInt(1, entity.getIdUsuario());
			ps.setInt(2, entity.getIdDestino());
			ps.setString(3, entity.getFechaInicio());
			ps.setString(4, entity.getFechaFin());
			ps.setInt(5, id);
			
			ps.executeUpdate();
			entity.setId(id);
			return entity;
		} catch (Exception e) {
			throw new RepositoryException("Error al actualizar la reserva", e);
		}
	}

	@Override
	public void deleteById(Connection conexion, Integer id) throws RepositoryException {
		String sql = "DELETE FROM reserva WHERE id = ?";
		try (PreparedStatement ps = conexion.prepareStatement(sql)) {
			ps.setInt(1, id);
			ps.executeUpdate();
		} catch (Exception e) {
			throw new RepositoryException("Error al eliminar la reserva", e);
		}
	}
}