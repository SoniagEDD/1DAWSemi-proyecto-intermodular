package pmo.daw.semi.model.repository;

import java.sql.Connection;
import pmo.daw.semi.model.entities.Pasaporte;
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
	    List<Usuario> lista = new ArrayList<>();
	    // Usamos un LEFT JOIN para traernos el usuario y su pasaporte en una sola consulta limpia
	    String sql = "SELECT u.*, p.numero, p.pais_expedicion, p.fecha_caducidad " +
	                 "FROM usuario u " +
	                 "LEFT JOIN pasaporte p ON u.id = p.id_usuario"; // Ajusta los nombres de las columnas si cambian
	    
	    try (PreparedStatement ps = conexion.prepareStatement(sql);
	         ResultSet rs = ps.executeQuery()) {
	         
	        while (rs.next()) {
	            Usuario u = new Usuario();
	            u.setId(rs.getInt("id"));
	            u.setNombre(rs.getString("nombre"));
	            u.setApellidos(rs.getString("apellidos"));
	            u.setEmail(rs.getString("email"));
	            u.setTelefono(rs.getString("telefono"));
	            
	            // Comprobamos si la fila de la base de datos trae un número de pasaporte
	            String numPasaporte = rs.getString("numero");
	            
	            if (numPasaporte != null) {
	                // Si tiene, creamos el objeto Pasaporte ahí mismo y se lo metemos al usuario
	                Pasaporte p = new Pasaporte();
	                p.setId(u.getId());
	                p.setNumero(numPasaporte);
	                p.setPaisExpedicion(rs.getString("pais_expedicion"));
	                
	                if (rs.getDate("fecha_caducidad") != null) {
	                    p.setFechaCaducidad(rs.getDate("fecha_caducidad").toLocalDate());
	                }
	                
	                u.setPasaporte(p);
	            } else {
	                // Si no tiene pasaporte en la BD, se queda explícitamente en null
	                u.setPasaporte(null);
	            }
	            
	            lista.add(u);
	        }
	    } catch (SQLException e) {
	        throw new RepositoryException("Error al listar los usuarios con su pasaporte", e);
	    }
	    return lista;
	}

	@Override
	public Usuario findById(Connection conexion, Integer id) throws RepositoryException {
	    if (id == null) return null;
	    
	    Usuario u = null;
	    // Hacemos el mismo LEFT JOIN que en el findAll, pero filtrando por el ID del usuario
	    String sql = "SELECT u.*, p.numero, p.pais_expedicion, p.fecha_caducidad " +
	                 "FROM usuario u " +
	                 "LEFT JOIN pasaporte p ON u.id = p.id_usuario " +
	                 "WHERE u.id = ?";
	    
	    try (PreparedStatement ps = conexion.prepareStatement(sql)) {
	        ps.setInt(1, id);
	        
	        try (ResultSet rs = ps.executeQuery()) {
	            if (rs.next()) {
	                u = new Usuario();
	                u.setId(rs.getInt("id"));
	                u.setNombre(rs.getString("nombre"));
	                u.setApellidos(rs.getString("apellidos"));
	                u.setEmail(rs.getString("email"));
	                u.setTelefono(rs.getString("telefono"));
	                
	                // Si tienes fecha de nacimiento en tu entidad Usuario, descomenta la siguiente línea:
	                // u.setFechaNacimiento(rs.getDate("fecha_nacimiento") != null ? rs.getDate("fecha_nacimiento").toLocalDate() : null);

	                // Comprobamos si la base de datos ha devuelto un número de pasaporte vinculado
	                String numPasaporte = rs.getString("numero");
	                
	                if (numPasaporte != null) {
	                    Pasaporte p = new Pasaporte();
	                    p.setId(u.getId());
	                    p.setNumero(numPasaporte);
	                    p.setPaisExpedicion(rs.getString("pais_expedicion"));
	                    
	                    if (rs.getDate("fecha_caducidad") != null) {
	                        p.setFechaCaducidad(rs.getDate("fecha_caducidad").toLocalDate());
	                    }
	                    
	                    // Metemos el pasaporte dentro del usuario
	                    u.setPasaporte(p);
	                } else {
	                    u.setPasaporte(null);
	                }
	            }
	        }
	    } catch (SQLException e) {
	        throw new RepositoryException("Error al buscar el usuario con ID: " + id, e);
	    }
	    
	    return u;
	}

	@Override
	public Usuario save(Connection conexion, Usuario usuario) throws RepositoryException {
	    // 1. Sentencia para insertar el usuario base
	    String sqlUsuario = "INSERT INTO usuario (nombre, apellidos, email, telefono) VALUES (?, ?, ?, ?)";
	    
	    // 2. Sentencia para insertar su pasaporte (Ajusta los nombres de las columnas si en tu BD cambian)
	    String sqlPasaporte = "INSERT INTO pasaporte (id_usuario, numero, pais_expedicion, fecha_caducidad) VALUES (?, ?, ?, ?)";

	    try (PreparedStatement psUser = conexion.prepareStatement(sqlUsuario, PreparedStatement.RETURN_GENERATED_KEYS)) {
	        
	        // Seteamos los datos del usuario
	        psUser.setString(1, usuario.getNombre());
	        psUser.setString(2, usuario.getApellidos());
	        psUser.setString(3, usuario.getEmail());
	        psUser.setString(4, usuario.getTelefono());
	        
	        int filasAfectadas = psUser.executeUpdate();
	        
	        if (filasAfectadas == 0) {
	            throw new RepositoryException("No se pudo crear el usuario.");
	        }

	        // ¡CLAVE!: Recuperamos el ID que la base de datos le ha asignado automáticamente al usuario
	        try (ResultSet generatedKeys = psUser.getGeneratedKeys()) {
	            if (generatedKeys.next()) {
	                int idGenerado = generatedKeys.getInt(1);
	                usuario.setId(idGenerado); // Se lo asignamos al objeto Java
	                
	                // ===================================================================
	                // ¡EL BLOQUE QUE FALTA!: Si el usuario viene con pasaporte, lo guardamos
	                // ===================================================================
	                if (usuario.getPasaporte() != null) {
	                    try (PreparedStatement psPasaporte = conexion.prepareStatement(sqlPasaporte)) {
	                        Pasaporte p = usuario.getPasaporte();
	                        
	                        psPasaporte.setInt(1, idGenerado); // Vinculamos el pasaporte al ID del nuevo usuario
	                        psPasaporte.setString(2, p.getNumero());
	                        psPasaporte.setString(3, p.getPaisExpedicion());
	                        
	                        // Convertimos la fecha de Java (LocalDate) a fecha de Base de Datos (java.sql.Date)
	                        if (p.getFechaCaducidad() != null) {
	                            psPasaporte.setDate(4, java.sql.Date.valueOf(p.getFechaCaducidad()));
	                        } else {
	                            psPasaporte.setNull(4, java.sql.Types.DATE);
	                        }
	                        
	                        psPasaporte.executeUpdate();
	                    }
	                }
	            }
	        }
	        
	    } catch (SQLException e) {
	        throw new RepositoryException("Error crítico al guardar usuario y pasaporte", e);
	    }
	    
	    return usuario;
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