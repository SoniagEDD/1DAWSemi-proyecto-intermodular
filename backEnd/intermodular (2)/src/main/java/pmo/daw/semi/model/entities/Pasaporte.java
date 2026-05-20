package pmo.daw.semi.model.entities;

import java.sql.ResultSet;
import java.time.LocalDate;

public class Pasaporte {

    private Integer id;
    private String numero;
    private String paisExpedicion;
    private LocalDate fechaCaducidad;
    private Integer idUsuario;

    public Pasaporte() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getPaisExpedicion() {
        return paisExpedicion;
    }

    public void setPaisExpedicion(String paisExpedicion) {
        this.paisExpedicion = paisExpedicion;
    }

    public LocalDate getFechaCaducidad() {
        return fechaCaducidad;
    }

    public void setFechaCaducidad(LocalDate fechaCaducidad) {
        this.fechaCaducidad = fechaCaducidad;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }


}