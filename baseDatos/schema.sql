-- archivo creacion de tablas (reserva se crea por relacion M:M usaurio-destino)

DROP TABLE IF EXISTS reserva;
DROP TABLE IF EXISTS pasaporte;
DROP TABLE IF EXISTS guia;
DROP TABLE IF EXISTS destino;
DROP TABLE IF EXISTS usuario;

-- tabla usuario
CREATE TABLE usuario (
    id INTEGER AUTO_INCREMENT,
    nombre VARCHAR(255),
    apellidos VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(255),
    fecha_nacimiento DATE,
    PRIMARY KEY (id),
    CONSTRAINT CK_mayor18 
        CHECK (fecha_nacimiento <= DATEADD('YEAR', -18, CURRENT_DATE))
);

-- tabla destino
CREATE TABLE destino (
    id INTEGER AUTO_INCREMENT,
    ciudad VARCHAR(255),
    pais VARCHAR(255),
    precio DECIMAL(10,2),
    requiere_pasaporte BOOLEAN,
    PRIMARY KEY (id)
);

-- tabla guia (sin enum en H2)
CREATE TABLE guia (
    id INTEGER AUTO_INCREMENT,
    nombre VARCHAR(255),
    apellidos VARCHAR(255),
    especialidad VARCHAR(50),
    id_destino INTEGER UNIQUE,
    PRIMARY KEY (id),
    FOREIGN KEY (id_destino) REFERENCES destino(id)
);

-- tabla pasaporte
CREATE TABLE pasaporte (
    id INTEGER AUTO_INCREMENT,
    numero VARCHAR(255),
    pais_expedicion VARCHAR(255),
    fecha_caducidad DATE,
    id_usuario INTEGER UNIQUE,
    PRIMARY KEY (id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    CONSTRAINT CK_caducidad 
        CHECK (fecha_caducidad > CURRENT_DATE)
);

-- tabla reserva
CREATE TABLE reserva (
    id_usuario INTEGER,
    id_destino INTEGER,
    fecha_inicio DATE,
    fecha_fin DATE,
    PRIMARY KEY (id_usuario, id_destino),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_destino) REFERENCES destino(id)
);
