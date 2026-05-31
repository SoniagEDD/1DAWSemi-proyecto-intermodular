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

//******************************************
// Copia Inscripcion */
document.addEventListener('DOMContentLoaded', () => {
  const selUsuario = document.getElementById('usuario');
  const selDestino = document.getElementById('destino');
  const form = document.getElementById('formInscripcion');
  const mensaje = document.getElementById('mensaje');

  // Cargamos los datos reales desde el backend en cuanto se abre la página
  cargarUsuarios();
  cargarDestinos();

  // --- 1. CARGAR USUARIOS REALES DESDE JAVA ---
  async function cargarUsuarios() {
    try {
      const res = await fetch('http://localhost:8080/api/usuario');
      if (!res.ok) throw new Error('Error al cargar usuarios');

      const usuarios = await res.json();

      // Limpiamos el select (por si acaso tiene opciones estáticas en el HTML)
      selUsuario.innerHTML =
        '<option value="">-- Selecciona un usuario --</option>';

      usuarios.forEach((u) => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.nombre; // Asegúrate de que tu entidad Usuario tenga la propiedad 'nombre'
        selUsuario.appendChild(opt);
      });
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('No se pudieron cargar los usuarios del servidor.', 'red');
    }
  }

  // --- 2. CARGAR DESTINOS REALES DESDE JAVA ---
  async function cargarDestinos() {
    try {
      const res = await fetch('http://localhost:8080/api/destino');
      if (!res.ok) throw new Error('Error al cargar destinos');

      const destinos = await res.json();

      selDestino.innerHTML =
        '<option value="">-- Selecciona un destino --</option>';

      destinos.forEach((d) => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.ciudad} (${d.pais})`; // Mostramos ciudad y país
        selDestino.appendChild(opt);
      });
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('No se pudieron cargar los destinos del servidor.', 'red');
    }
  }

  // --- 3. EVENTO AL ENVIAR EL FORMULARIO (POST REAL) ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      mostrarMensaje('Por favor, rellena todos los campos.', 'red');
      return;
    }

    const idUsuario = selUsuario.value;
    const idDestino = selDestino.value;

    // Validar que las fechas sean lógicas
    const inicio = document.getElementById('fechaInicio').value;
    const fin = document.getElementById('fechaFin').value;

    if (inicio >= fin) {
      mostrarMensaje(
        'La fecha de inicio debe ser anterior a la fecha de fin.',
        'red'
      );
      return;
    }

    // --- ENVIAR DATOS REALES A JAVA ---
    try {
      // Estructuramos el objeto JSON exactamente como lo espera recibir la entidad Reserva.java
      const nuevaReserva = {
        idUsuario: Number(idUsuario),
        idDestino: Number(idDestino),
        fechaInicio: inicio,
        fechaFin: fin
      };

      const res = await fetch('http://localhost:8080/api/reserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaReserva)
      });

      if (res.ok) {
        alert('¡Inscripción realizada correctamente!');
        // Redirigimos al listado de reservas que acabamos de crear hace un momento
        window.location.href = 'listado-reservas.html';
      } else {
        alert('Este destino requiere pasaporte', 'red');
        window.location.href = 'crear-reserva.html';
      }
    } catch (error) {
      console.error('Error en el POST:', error);
      mostrarMensaje('Este destino requiere pasaporte', 'red');
    }
  });

  function mostrarMensaje(texto, color) {
    mensaje.textContent = texto;
    mensaje.style.color = color;
  }
});
