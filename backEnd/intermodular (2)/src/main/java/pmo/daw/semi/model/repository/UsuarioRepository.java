package pmo.daw.semi.model.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import pmo.daw.semi.excepciones.RepositoryException;
import pmo.daw.semi.model.entities.Usuario;
import pmo.daw.semi.model.repository.base.BaseRepository;

public class UsuarioRepository extends BaseRepository<Usuario, Integer> {
	
	private static final UsuarioRepository INSTANCE = new UsuarioRepository();
	private UsuarioRepository() {}
	public static UsuarioRepository getInstance() {
		return INSTANCE;
	}

	// =========================================================================
	// METODO HEREDADO: Lo dejamos devolviendo null ya que no usamos mapeo automático
	// =========================================================================
	/*@Override
	protected Object mapResultSet(ResultSet rs) throws SQLException {
		return null;
	}*/

	@Override
	public List<Usuario> findAll(Connection conexion) throws RepositoryException {
		List<Usuario> usuarios = new ArrayList<>();
		String sql = "SELECT id, nombre, apellidos, email, telefono FROM usuario";

		try (PreparedStatement ps = conexion.prepareStatement(sql);
			 ResultSet rs = ps.executeQuery()) {

			while (rs.next()) {
				Usuario usuario = new Usuario();
				usuario.setId(rs.getInt("id"));
				usuario.setNombre(rs.getString("nombre"));
				usuario.setApellidos(rs.getString("apellidos"));
				usuario.setEmail(rs.getString("email"));
				usuario.setTelefono(rs.getString("telefono"));
				
				usuarios.add(usuario);
			}
		} catch (SQLException sqlException) {
			throw new RepositoryException("Fallo buscando todos los usuarios", sqlException);
		}
		return usuarios;
	}

	@Override
	public Usuario findById(Connection conexion, Integer id) throws RepositoryException {
		String sql = "SELECT id, nombre, apellidos, email, telefono FROM usuario WHERE id = ?";

		try (PreparedStatement ps = conexion.prepareStatement(sql)) {
			ps.setInt(1, id);

			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					Usuario usuario = new Usuario();
					usuario.setId(rs.getInt("id"));
					usuario.setNombre(rs.getString("nombre"));
					usuario.setApellidos(rs.getString("apellidos"));
					usuario.setEmail(rs.getString("email"));
					usuario.setTelefono(rs.getString("telefono"));
					return usuario;
				}
			}
		} catch (SQLException sqlException) {
			throw new RepositoryException("Fallo buscando el usuario con id = " + id, sqlException);
		}
		return null;
	}

	@Override
	public Usuario save(Connection conexion, Usuario entity) throws RepositoryException {
		String sql = "INSERT INTO usuario (nombre, apellidos, email, telefono) VALUES (?, ?, ?, ?)";
		
		try (PreparedStatement ps = conexion.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {
			ps.setString(1, entity.getNombre());
			ps.setString(2, entity.getApellidos());
			ps.setString(3, entity.getEmail());
			ps.setString(4, entity.getTelefono());
			
			ps.executeUpdate();
			
			try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
				if (generatedKeys.next()) {
					entity.setId(generatedKeys.getInt(1));
				}
			}
			return entity;
		} catch (SQLException sqlException) {
			throw new RepositoryException("Fallo al guardar el nuevo usuario", sqlException);
		}
	}

	@Override
	public Usuario update(Connection conexion, Integer id, Usuario entity) throws RepositoryException {
		String sql = "UPDATE usuario SET nombre = ?, apellidos = ?, email = ?, telefono = ? WHERE id = ?";
		
		try (PreparedStatement ps = conexion.prepareStatement(sql)) {
			ps.setString(1, entity.getNombre());
			ps.setString(2, entity.getApellidos());
			ps.setString(3, entity.getEmail());
			ps.setString(4, entity.getTelefono());
			ps.setInt(5, id);
			
			ps.executeUpdate();
			entity.setId(id);
			return entity;
		} catch (SQLException sqlException) {
			throw new RepositoryException("Fallo al actualizar el usuario con id = " + id, sqlException);
		}
	}

	@Override
	public void deleteById(Connection conexion, Integer id) throws RepositoryException {
		String sql = "DELETE FROM usuario WHERE id = ?";
		
		try (PreparedStatement ps = conexion.prepareStatement(sql)) {
			ps.setInt(1, id);
			ps.executeUpdate();
		} catch (SQLException sqlException) {
			throw new RepositoryException("Fallo al eliminar el usuario con id = " + id, sqlException);
		}
	}
}