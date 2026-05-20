document.addEventListener('DOMContentLoaded', () => {
  const tablaReservas = document.getElementById('tablaReservas');

  // Si la tabla existe en la página actual, cargamos los datos desde Java
  if (tablaReservas) {
    cargarReservas();
  }

  /**
   * Función principal que conecta con el Backend para listar las reservas
   */
  async function cargarReservas() {
    const mensaje = document.getElementById('mensaje');

    try {
      // Petición GET a tu API de reservas en Spring Boot
      const res = await fetch('http://localhost:8080/api/reserva');

      if (!res.ok) {
        throw new Error(
          'Error al conectar con el servidor, estado: ' + res.status
        );
      }

      const reservas = await res.json();

      // Limpiamos la tabla por si tiene contenido de prueba viejo
      tablaReservas.innerHTML = '';

      // Si la base de datos no tiene reservas, avisamos al usuario
      if (reservas.length === 0) {
        tablaReservas.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; color: #555;">
              No hay ninguna reserva registrada en este momento.
            </td>
          </tr>
        `;
        return;
      }

      // Recorremos el array de reservas devuelto por Java
      reservas.forEach((r) => {
        const fila = document.createElement('tr');

        // Extraemos las relaciones de manera segura por si algún campo viene null o vacío
        const idUsuario = r.usuario ? r.usuario.id : 'N/A';
        const nombreUsuario = r.usuario
          ? `${r.usuario.nombre} ${r.usuario.apellidos || ''}`
          : 'Desconocido';
        // Cambiamos r.destino.nombre por r.destino.ciudad
        const nombreDestino = r.destino ? r.destino.ciudad : 'Sin destino';

        // Formateamos las fechas de Spring (quedándonos solo con la parte YYYY-MM-DD si traen timestamp)
        const fechaIn = r.fechaInicio
          ? r.fechaInicio.split('T')[0]
          : 'No asignada';
        const fechaFi = r.fechaFin ? r.fechaFin.split('T')[0] : 'No asignada';

        // Inyectamos el HTML de las celdas respetando las columnas de tu cabecera
        fila.innerHTML = `
          <td>${idUsuario}</td>
          <td>${nombreUsuario}</td>
          <td>${nombreDestino}</td>
          <td>${fechaIn}</td>
          <td>${fechaFi}</td>
          <td>
             <button class="btn btn-editar" onclick="editarReserva(${r.id})">Modificar</button>
              <button class="btn btn-eliminar" onclick="eliminarReserva(${r.id})">Eliminar</button>
          </td>
          <td></td> `;

        tablaReservas.appendChild(fila);
      });
    } catch (error) {
      if (mensaje) {
        mensaje.textContent =
          'No se pudieron cargar las reservas de la base de datos.';
        mensaje.style.color = 'red';
      }
      console.error('Error detallado en la carga de reservas:', error);
    }
  }
});

/**
 * Función global para redirigir al formulario de edición pasando el ID por la URL
 */
function editarReserva(id) {
  window.location.href = `modificar-reserva.html?id=${id}`;
}

/**
 * Función global para conectar con el método DELETE de Java y borrar una reserva
 */
async function eliminarReserva(id) {
  if (
    !confirm(
      '¿Estás seguro de que deseas eliminar permanentemente esta reserva?'
    )
  ) {
    return;
  }

  try {
    // Petición DELETE a tu controlador de Java
    const res = await fetch(`http://localhost:8080/api/reserva/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Reserva eliminada correctamente.');
      // Recargamos la página actual para que desaparezca la fila borrada
      location.reload();
    } else {
      alert('El servidor no ha podido eliminar la reserva.');
    }
  } catch (error) {
    console.error('Error en la petición DELETE:', error);
    alert('Error crítico: No se pudo conectar con el servidor.');
  }
}
