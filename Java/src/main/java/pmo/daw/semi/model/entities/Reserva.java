package pmo.daw.semi.model.entities;

public class Reserva {
    private Integer id;
    private Integer idUsuario;
    private Integer idDestino;
    private String fechaInicio;
    private String fechaFin;

    // Campos auxiliares que espera recibir el JavaScript para pintar nombres en la tabla
    private Object usuario; 
    private Object destino;

    public Reserva() {}

    public Reserva(Integer id, Integer idUsuario, Integer idDestino, String fechaInicio, String fechaFin) {
        this.id = id;
        this.idUsuario = idUsuario;
        this.idDestino = idDestino;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdDestino() { return idDestino; }
    public void setIdDestino(Integer idDestino) { this.idDestino = idDestino; }

    public String getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(String fechaInicio) { this.fechaInicio = fechaInicio; }

    public String getFechaFin() { return fechaFin; }
    public void setFechaFin(String fechaFin) { this.fechaFin = fechaFin; }

    public Object getUsuario() { return usuario; }
    public void setUsuario(Object usuario) { this.usuario = usuario; }

    public Object getDestino() { return destino; }
    public void setDestino(Object destino) { this.destino = destino; }
}