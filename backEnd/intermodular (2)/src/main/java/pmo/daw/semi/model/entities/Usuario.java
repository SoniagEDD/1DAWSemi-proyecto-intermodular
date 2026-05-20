package pmo.daw.semi.model.entities;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Usuario {

    private Integer id;
    private String nombre;
    private String apellidos;
    private String email;
    private String telefono;
    private LocalDate fechaNacimiento;
    private List<Reserva> reservas;
    private Pasaporte pasaporte;

    public Integer getId() { return id; }
	public void setId(Integer id) { this.id = id; }
	
	public String getNombre() { return nombre; }
	public void setNombre(String nombre) { this.nombre = nombre; }
	
	public String getApellidos() { return apellidos; }
	public void setApellidos(String apellidos) { this.apellidos = apellidos; }
	
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	
	public String getTelefono() { return telefono; }
	public void setTelefono(String telefono) { this.telefono = telefono; }
	
	public LocalDate getFechaNacimiento() { return fechaNacimiento; }
	public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    @JsonIgnore
    public Date getFechaNacimientoDate() { return fechaNacimiento == null ? null : java.sql.Date.valueOf(fechaNacimiento); }
    public void setFechaNacimientoDate(Date fechaNacimiento) { this.fechaNacimiento = fechaNacimiento == null ? null : fechaNacimiento.toLocalDate(); }

	public List<Reserva> getReservas() { return reservas; }
	public void setReservas(List<Reserva> reservas) { this.reservas = reservas; }
	
	public Pasaporte getPasaporte() { return pasaporte; }
	public void setPasaporte(Pasaporte pasaporte) { this.pasaporte = pasaporte; }
	
	@Override
	public String toString() {
		return "Usuario [id=" + id + ", nombre=" + nombre + ", apellidos=" + apellidos + ", email=" + email
				+ ", telefono=" + telefono + ", fechaNacimiento=" + fechaNacimiento + ", reservas=" + reservas
				+ ", pasaporte=" + pasaporte + "]";
	}

    /**
     * Mapea un ResultSet a un objeto Usuario.
     * @param rs ResultSet con la fila de usuario
     * @return Usuario mapeado
     * @throws SQLException si ocurre un error de SQL
     */
	public static Usuario mapResultSet(ResultSet rs) throws SQLException {
		return mapResultSet(rs, "");
	}

	public static Usuario mapResultSet(ResultSet rs, String alias) throws SQLException {
		Usuario usuario = new Usuario();
		usuario.setId(rs.getInt(alias + "id"));
		usuario.setNombre(rs.getString(alias + "nombre"));
		usuario.setApellidos(rs.getString(alias + "apellidos"));
		usuario.setEmail(rs.getString(alias + "email"));
		usuario.setTelefono(rs.getString(alias + "telefono"));
		usuario.setFechaNacimientoDate(rs.getDate(alias + "fecha_nacimiento"));
		return usuario;
	}
}