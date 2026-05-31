-- USUARIOS
INSERT INTO usuario (id, nombre, apellidos, email, telefono, fecha_nacimiento) VALUES
(1, 'Juan', 'Pérez', 'juan@email.com', '600111222', '1995-03-10'),
(2, 'Laura', 'García', 'laura@email.com', '600333444', '1990-07-21'),
(3, 'Carlos', 'López', 'carlos@email.com', '600555666', '1988-11-05');

ALTER TABLE usuario ALTER COLUMN id RESTART WITH 4;

-- PASAPORTES
INSERT INTO pasaporte (id, numero, pais_expedicion, fecha_caducidad, id_usuario) VALUES
(1, 'X1234567', 'España', '2030-05-01', 1),
(2, 'Y7654321', 'España', '2029-09-15', 2);

ALTER TABLE pasaporte ALTER COLUMN id RESTART WITH 3;

INSERT INTO destino
(ciudad, pais, precio, requiere_pasaporte)
VALUES
('Madrid', 'Espa�a', 250.0, false),
('Paris', 'Francia', 500, true)
('Roma', 'Italia', 320.0, true);

INSERT INTO guia (nombre, apellidos, especialidad, id_destino)
VALUES
('Miguel', 'Sanchez', 'Historia', 1);


