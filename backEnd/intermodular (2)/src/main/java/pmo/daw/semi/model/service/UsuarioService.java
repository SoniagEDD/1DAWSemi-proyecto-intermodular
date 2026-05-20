package pmo.daw.semi.model.service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import pmo.daw.semi.excepciones.ServiceException;
import pmo.daw.semi.model.entities.Usuario;
import pmo.daw.semi.model.repository.UsuarioRepository;
import pmo.daw.semi.model.service.base.BaseService;

public class UsuarioService extends BaseService<Usuario, Integer> {

    // =============================================
    // Singleton
    // =============================================

    private static final UsuarioService INSTANCE = new UsuarioService();

    private UsuarioService() {}

    public static UsuarioService getInstance() {
        return INSTANCE;
    }

    // =============================================
    // Repositorios
    // =============================================

    private final UsuarioRepository usuarioRepository = UsuarioRepository.getInstance();

    // =============================================
    // MÉTODOS PUENTE (Apertura segura de conexiones)
    // =============================================

    public List<Usuario> findAll() throws ServiceException {
        try (Connection conexion = getConnection()) {
            if (conexion == null) {
                throw new ServiceException("No se pudo obtener una conexión válida de la base de datos.");
            }
            return this.findAll(conexion);
        } catch (SQLException e) {
            throw new ServiceException("Error al gestionar la conexión en findAll", e);
        }
    }

    public Usuario findById(Integer id) throws ServiceException {
        try (Connection conexion = getConnection()) {
            if (conexion == null) {
                throw new ServiceException("No se pudo obtener una conexión válida de la base de datos.");
            }
            return this.findById(conexion, id);
        } catch (SQLException e) {
            throw new ServiceException("Error al gestionar la conexión en findById", e);
        }
    }

    public Usuario save(Usuario usuario) throws ServiceException {
        try (Connection conexion = getConnection()) {
            if (conexion == null) {
                throw new ServiceException("No se pudo obtener una conexión válida de la base de datos.");
            }
            return this.save(conexion, usuario);
        } catch (SQLException e) {
            throw new ServiceException("Error al gestionar la conexión en save", e);
        }
    }

    public Usuario update(Integer id, Usuario usuario) throws ServiceException {
        try (Connection conexion = getConnection()) {
            if (conexion == null) {
                throw new ServiceException("No se pudo obtener una conexión válida de la base de datos.");
            }
            return this.update(conexion, id, usuario);
        } catch (SQLException e) {
            throw new ServiceException("Error al gestionar la conexión en update", e);
        }
    }

    public void deleteById(Integer id) throws ServiceException {
        try (Connection conexion = getConnection()) {
            if (conexion == null) {
                throw new ServiceException("No se pudo obtener una conexión válida de la base de datos.");
            }
            this.deleteById(conexion, id);
        } catch (SQLException e) {
            throw new ServiceException("Error al gestionar la conexión en deleteById", e);
        }
    }

    // =============================================
    // CRUD REAL (Reciben la conexión activa)
    // =============================================

    @Override
    public List<Usuario> findAll(Connection conexion) throws ServiceException {
        return usuarioRepository.findAll(conexion);
    }

    @Override
    public Usuario findById(Connection conexion, Integer id) throws ServiceException {
        if (id == null) {
            throw new ServiceException("id no puede ser null");
        }
        Usuario usuario = usuarioRepository.findById(conexion, id);
        if (usuario == null) {
            throw new ServiceException("usuario no encontrado con id = " + id);
        }
        return usuario;
    }

    @Override
    public Usuario save(Connection conexion, Usuario usuario) throws ServiceException {
        if (usuario == null) {
            throw new ServiceException("usuario no puede ser null");
        }
        return usuarioRepository.save(conexion, usuario);
    }

    @Override
    public Usuario update(Connection conexion, Integer id, Usuario usuario) throws ServiceException {
        if (id == null) {
            throw new ServiceException("id no puede ser null");
        }
        if (usuario == null) {
            throw new ServiceException("usuario no puede ser null");
        }

        Usuario usuarioExistente = usuarioRepository.findById(conexion, id);
        if (usuarioExistente == null) {
            throw new ServiceException("usuario no encontrado con id = " + id);
        }

        usuarioExistente.setNombre(usuario.getNombre());
        usuarioExistente.setApellidos(usuario.getApellidos());
        usuarioExistente.setEmail(usuario.getEmail());
        usuarioExistente.setTelefono(usuario.getTelefono());
        usuarioExistente.setFechaNacimiento(usuario.getFechaNacimiento());

        return usuarioRepository.update(conexion, id, usuarioExistente);
    }

    @Override
    public void deleteById(Connection conexion, Integer id) throws ServiceException {
        if (id == null) {
            throw new ServiceException("id no puede ser null");
        }
        Usuario usuarioExistente = usuarioRepository.findById(conexion, id);
        if (usuarioExistente == null) {
            throw new ServiceException("usuario no encontrado con id = " + id);
        }
        usuarioRepository.deleteById(conexion, id);
    }
}