document.addEventListener('DOMContentLoaded', () => {
  const tablaReservas = document.getElementById('tablaReservas');

  const formReserva = document.getElementById('formReserva');

  const formModificar = document.getElementById('formModificarReserva');

  // ==========================================
  // LISTAR RESERVAS
  // ==========================================
  if (tablaReservas) {
    cargarReservas();
  }

  async function cargarReservas() {
    try {
      const res = await fetch('http://localhost:8080/api/reserva');

      if (!res.ok) {
        throw new Error('Error cargando reservas');
      }

      const reservas = await res.json();

      tablaReservas.innerHTML = '';

      reservas.forEach((r) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td>${r.id}</td>
          <td>${r.idUsuario}</td>
          <td>${r.idDestino}</td>
          <td>${r.fechaInicio}</td>
          <td>${r.fechaFin || 'N/A'}</td>

          <td>
            <button 
              class="btn btn-modificar"
              onclick="modificarReserva(${r.id})">
              Modificar
            </button>

            <button 
              class="btn btn-eliminar"
              onclick="eliminarReserva(${r.id})">
              Eliminar
            </button>
          </td>
        `;

        tablaReservas.appendChild(fila);
      });
    } catch (error) {
      console.error(error);

      alert('Error cargando reservas');
    }
  }

  // ==========================================
  // CREAR RESERVA
  // ==========================================
  if (formReserva) {
    formReserva.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nuevaReserva = {
        idUsuario: Number(document.getElementById('idUsuario').value),

        idDestino: Number(document.getElementById('idDestino').value),

        fechaInicio: document.getElementById('fechaInicio').value,

        fechaFin: document.getElementById('fechaFin').value
      };

      try {
        const res = await fetch('http://localhost:8080/api/reserva', {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(nuevaReserva)
        });

        if (res.ok) {
          alert('Reserva creada correctamente');

          window.location.href = 'listado-reservas.html';
        } else {
          const errorTexto = await res.text();

          alert(errorTexto);
        }
      } catch (error) {
        console.error(error);

        alert('Error conectando con el servidor');
      }
    });
  }

  // ==========================================
  // CARGAR DATOS PARA MODIFICAR
  // ==========================================
  async function cargarDatosModificar() {
    const params = new URLSearchParams(window.location.search);

    const id = params.get('id');

    if (!id) return;

    try {
      const res = await fetch(`http://localhost:8080/api/reserva/${id}`);

      if (!res.ok) {
        throw new Error();
      }

      const reserva = await res.json();

      document.getElementById('idUsuario').value = reserva.idUsuario;

      document.getElementById('idDestino').value = reserva.idDestino;

      document.getElementById('fechaInicio').value = reserva.fechaInicio;

      document.getElementById('fechaFin').value = reserva.fechaFin;
    } catch (error) {
      console.error(error);

      alert('Error cargando reserva');
    }
  }

  // ==========================================
  // MODIFICAR RESERVA
  // ==========================================
  if (formModificar) {
    cargarDatosModificar();

    formModificar.addEventListener('submit', async (e) => {
      e.preventDefault();

      const params = new URLSearchParams(window.location.search);

      const id = params.get('id');

      const reservaModificada = {
        idUsuario: Number(document.getElementById('idUsuario').value),

        idDestino: Number(document.getElementById('idDestino').value),

        fechaInicio: document.getElementById('fechaInicio').value,

        fechaFin: document.getElementById('fechaFin').value
      };

      try {
        const res = await fetch(`http://localhost:8080/api/reserva/${id}`, {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(reservaModificada)
        });

        if (res.ok) {
          alert('Reserva modificada correctamente');

          window.location.href = 'listado-reservas.html';
        } else {
          alert('Error modificando reserva');
        }
      } catch (error) {
        console.error(error);

        alert('Error conectando con el servidor');
      }
    });
  }

  // referencia global
  window._refrescarReservas = cargarReservas;
});

// ==========================================
// FUNCIONES GLOBALES
// ==========================================

function modificarReserva(id) {
  window.location.href = `modificar-reserva.html?id=${id}`;
}

async function eliminarReserva(id) {
  if (!confirm('¿Seguro que deseas eliminar esta reserva?')) {
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/reserva/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Reserva eliminada');

      if (window._refrescarReservas) {
        window._refrescarReservas();
      }
    } else {
      alert('Error eliminando reserva');
    }
  } catch (error) {
    console.error(error);

    alert('Error de conexión');
  }
}
