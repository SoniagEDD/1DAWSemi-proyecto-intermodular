package pmo.daw.semi.model.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import pmo.daw.semi.excepciones.RepositoryException;
import pmo.daw.semi.model.entities.Destino;
import pmo.daw.semi.model.repository.base.BaseRepository;

public class DestinoRepository
        extends BaseRepository<Destino, Integer> {

    private static final DestinoRepository INSTANCE =
            new DestinoRepository();

    private DestinoRepository() {}

    public static DestinoRepository getInstance() {
        return INSTANCE;
    }

    // =========================
    // FIND ALL
    // =========================

    @Override
    public List<Destino> findAll(Connection conexion)
            throws RepositoryException {

        List<Destino> lista = new ArrayList<>();

        String sql =
                "SELECT * FROM destino";

        try (PreparedStatement ps =
                     conexion.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {

                Destino d = new Destino();

                d.setId(rs.getInt("id"));
                d.setCiudad(rs.getString("ciudad"));
                d.setPais(rs.getString("pais"));
                d.setPrecio(rs.getDouble("precio"));
                d.setRequierePasaporte(
                        rs.getBoolean(
                                "requiere_pasaporte"
                        )
                );

                lista.add(d);
            }

        } catch (SQLException e) {

            throw new RepositoryException(
                    "Error al listar destinos", e);
        }

        return lista;
    }

    // =========================
    // FIND BY ID
    // =========================

    @Override
    public Destino findById(Connection conexion,
                            Integer id)
            throws RepositoryException {

        String sql =
                "SELECT * FROM destino WHERE id = ?";

        try (PreparedStatement ps =
                     conexion.prepareStatement(sql)) {

            ps.setInt(1, id);

            try (ResultSet rs = ps.executeQuery()) {

                if (rs.next()) {

                    Destino destino = new Destino();

                    destino.setId(rs.getInt("id"));
                    destino.setCiudad(rs.getString("ciudad"));
                    destino.setPais(rs.getString("pais"));
                    destino.setPrecio(rs.getDouble("precio"));
                    destino.setRequierePasaporte(
                            rs.getBoolean("requiere_pasaporte")
                    );

                    return destino;
                }
            }

        } catch (SQLException e) {

            throw new RepositoryException(
                    "Error al buscar destino por id",
                    e
            );
        }

        return null;
    }

    // =========================
    // SAVE
    // =========================

    @Override
    public Destino save(Connection conexion,
                         Destino entity)
            throws RepositoryException {

        String sql =
                "INSERT INTO destino " +
                "(ciudad, pais, precio, requiere_pasaporte) " +
                "VALUES (?, ?, ?, ?)";

        try (PreparedStatement ps =
                     conexion.prepareStatement(
                             sql,
                             PreparedStatement.RETURN_GENERATED_KEYS
                     )) {

            ps.setString(1, entity.getCiudad());
            ps.setString(2, entity.getPais());
            ps.setDouble(3, entity.getPrecio());
            ps.setBoolean(
                    4,
                    entity.getRequierePasaporte()
            );

            ps.executeUpdate();

            try (ResultSet rs =
                         ps.getGeneratedKeys()) {

                if (rs.next()) {

                    entity.setId(rs.getInt(1));
                }
            }

        } catch (SQLException e) {

            throw new RepositoryException(
                    "Error al guardar destino", e);
        }

        return entity;
    }

    // =========================
    // UPDATE
    // =========================

    @Override
    public Destino update(Connection conexion,
                          Integer id,
                          Destino entity)
            throws RepositoryException {

        String sql =
                "UPDATE destino " +
                "SET ciudad = ?, " +
                "pais = ?, " +
                "precio = ?, " +
                "requiere_pasaporte = ? " +
                "WHERE id = ?";

        try (PreparedStatement ps =
                     conexion.prepareStatement(sql)) {

            ps.setString(1, entity.getCiudad());
            ps.setString(2, entity.getPais());
            ps.setDouble(3, entity.getPrecio());
            ps.setBoolean(
                    4,
                    entity.getRequierePasaporte()
            );
            ps.setInt(5, id);

            ps.executeUpdate();

        } catch (SQLException e) {

            throw new RepositoryException(
                    "Error al modificar destino", e);
        }

        entity.setId(id);

        return entity;
    }

    // =========================
    // DELETE
    // =========================

    @Override
    public void deleteById(Connection conexion,
                           Integer id)
            throws RepositoryException {

        String sql =
                "DELETE FROM destino WHERE id = ?";

        try (PreparedStatement ps =
                     conexion.prepareStatement(sql)) {

            ps.setInt(1, id);

            ps.executeUpdate();

        } catch (SQLException e) {

            throw new RepositoryException(
                    "Error al eliminar destino", e);
        }
    }
}