package pmo.daw.semi.model.repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import pmo.daw.semi.excepciones.RepositoryException;
import pmo.daw.semi.model.entities.Pasaporte;
import pmo.daw.semi.model.repository.base.BaseRepository;

public class PasaporteRepository
extends BaseRepository<Pasaporte, Integer> {

private static final PasaporteRepository INSTANCE =
    new PasaporteRepository();

private PasaporteRepository() {}

public static PasaporteRepository getInstance() {
return INSTANCE;
}

@Override
public List<Pasaporte> findAll(Connection conexion)
    throws RepositoryException {

List<Pasaporte> lista = new ArrayList<>();

String sql = "SELECT * FROM pasaporte";

try (PreparedStatement ps =
             conexion.prepareStatement(sql);
     ResultSet rs = ps.executeQuery()) {

    while (rs.next()) {

        Pasaporte p = new Pasaporte();

        p.setId(rs.getInt("id"));
        p.setNumero(rs.getString("numero"));
        p.setPaisExpedicion(
                rs.getString("pais_expedicion")
        );
        p.setFechaCaducidad(
                rs.getDate("fecha_caducidad")
                        .toLocalDate()
        );
        p.setIdUsuario(rs.getInt("id_usuario"));

        lista.add(p);
    }

} catch (SQLException e) {

    throw new RepositoryException(
            "Error al listar pasaportes", e);
}

return lista;
}
@Override
public Pasaporte findById(Connection conexion,
                          Integer id)
        throws RepositoryException {

    String sql =
            "SELECT * FROM pasaporte WHERE id = ?";

    try (PreparedStatement ps =
                 conexion.prepareStatement(sql)) {

        ps.setInt(1, id);

        try (ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {

                Pasaporte p = new Pasaporte();

                p.setId(rs.getInt("id"));
                p.setNumero(rs.getString("numero"));
                p.setPaisExpedicion(
                        rs.getString("pais_expedicion")
                );
                p.setFechaCaducidad(
                        rs.getDate("fecha_caducidad")
                                .toLocalDate()
                );
                p.setIdUsuario(rs.getInt("id_usuario"));

                return p;
            }
        }

    } catch (SQLException e) {

        throw new RepositoryException(
                "Error buscando pasaporte", e);
    }

    return null;
}

@Override
public Pasaporte save(Connection conexion,
                      Pasaporte entity)
        throws RepositoryException {

    String sql =
            "INSERT INTO pasaporte " +
            "(numero, pais_expedicion, fecha_caducidad, id_usuario) " +
            "VALUES (?, ?, ?, ?)";

    try (PreparedStatement ps =
                 conexion.prepareStatement(
                         sql,
                         PreparedStatement.RETURN_GENERATED_KEYS
                 )) {

        ps.setString(1, entity.getNumero());
        ps.setString(2, entity.getPaisExpedicion());
        ps.setDate(
                3,
                Date.valueOf(entity.getFechaCaducidad())
        );
        ps.setInt(4, entity.getIdUsuario());

        ps.executeUpdate();

        try (ResultSet rs = ps.getGeneratedKeys()) {

            if (rs.next()) {
                entity.setId(rs.getInt(1));
            }
        }

    } catch (SQLException e) {

        throw new RepositoryException(
                "Error guardando pasaporte", e);
    }

    return entity;
}
@Override
public Pasaporte update(Connection conexion,
                        Integer id,
                        Pasaporte entity)
        throws RepositoryException {

    String sql =
            "UPDATE pasaporte SET " +
            "numero = ?, " +
            "pais_expedicion = ?, " +
            "fecha_caducidad = ?, " +
            "id_usuario = ? " +
            "WHERE id = ?";

    try (PreparedStatement ps =
                 conexion.prepareStatement(sql)) {

        ps.setString(1, entity.getNumero());
        ps.setString(2, entity.getPaisExpedicion());
        ps.setDate(
                3,
                Date.valueOf(entity.getFechaCaducidad())
        );
        ps.setInt(4, entity.getIdUsuario());
        ps.setInt(5, id);

        ps.executeUpdate();

    } catch (SQLException e) {

        throw new RepositoryException(
                "Error modificando pasaporte", e);
    }

    entity.setId(id);

    return entity;
}
@Override
public void deleteById(Connection conexion,
                       Integer id)
        throws RepositoryException {

    String sql =
            "DELETE FROM pasaporte WHERE id = ?";

    try (PreparedStatement ps =
                 conexion.prepareStatement(sql)) {

        ps.setInt(1, id);

        ps.executeUpdate();

    } catch (SQLException e) {

        throw new RepositoryException(
                "Error eliminando pasaporte", e);
    }
}


public Pasaporte findByIdUsuario(
        Connection conexion,
        Integer idUsuario)
        throws RepositoryException {

    String sql =
            "SELECT * FROM pasaporte WHERE id_usuario = ?";

    try (PreparedStatement ps =
                 conexion.prepareStatement(sql)) {

        ps.setInt(1, idUsuario);

        try (ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {

                Pasaporte p = new Pasaporte();

                p.setId(rs.getInt("id"));
                p.setNumero(rs.getString("numero"));
                p.setPaisExpedicion(
                        rs.getString("pais_expedicion"));
                p.setFechaCaducidad(
                        rs.getDate("fecha_caducidad")
                                .toLocalDate());

                p.setIdUsuario(
                        rs.getInt("id_usuario"));

                return p;
            }
        }

    } catch (SQLException e) {

        throw new RepositoryException(
                "Error buscando pasaporte por usuario",
                e);
    }

    return null;
}
private Pasaporte mapResultSet(ResultSet rs)
        throws SQLException {

    Pasaporte p = new Pasaporte();

    p.setId(rs.getInt("id"));

    p.setNumero(
            rs.getString("numero"));

    p.setPaisExpedicion(
            rs.getString("pais_expedicion"));

    if (rs.getDate("fecha_caducidad") != null) {

        p.setFechaCaducidad(
                rs.getDate("fecha_caducidad")
                        .toLocalDate());
    }

    p.setIdUsuario(
            rs.getInt("id_usuario"));

    return p;
}
}

