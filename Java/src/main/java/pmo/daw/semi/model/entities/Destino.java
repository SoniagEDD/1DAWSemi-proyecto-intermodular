package pmo.daw.semi.model.entities;

public class Destino {

    private Integer id;
    private String ciudad;
    private String pais;
    private Double precio;
    private Boolean requierePasaporte;

    public Destino() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Boolean getRequierePasaporte() {
        return requierePasaporte;
    }

    public void setRequierePasaporte(Boolean requierePasaporte) {
        this.requierePasaporte = requierePasaporte;
    }
}