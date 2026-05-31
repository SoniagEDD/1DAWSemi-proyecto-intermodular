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

    // Comprobar si el usuario tiene pasaporte consultando al backend
    const tienePasaporte = await comprobarPasaporte(idUsuario);

    if (!tienePasaporte) {
      mostrarMensaje(
        'Este usuario NO ha registrado pasaporte. No puede inscribirse.',
        'red'
      );
      return;
    }

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
        mostrarMensaje(
          'Hubo un error en el servidor al procesar la reserva.',
          'red'
        );
      }
    } catch (error) {
      console.error('Error en el POST:', error);
      mostrarMensaje(
        'No se pudo conectar con el servidor para guardar la reserva.',
        'red'
      );
    }
  });

  // --- 4. COMPROBAR PASAPORTE REAL DESDE EL CONTROLADOR DE USUARIOS ---
  async function comprobarPasaporte(idUsuario) {
    try {
      // Hacemos una petición para obtener los datos de ese usuario concreto
      const res = await fetch(`http://localhost:8080/api/usuario/${idUsuario}`);
      if (!res.ok) return false;

      const usuario = await res.json();

      // Retorna true o false dependiendo de la propiedad de tu base de datos (ej: tienePasaporte, requierePasaporte...)
      // Cambia 'u.tienePasaporte' por el nombre exacto que tenga ese campo booleano en tu clase Usuario de Java
      return usuario.tienePasaporte === true || usuario.pasaporte === true;
    } catch (error) {
      console.error('Error validando pasaporte:', error);
      return false;
    }
  }

  function mostrarMensaje(texto, color) {
    mensaje.textContent = texto;
    mensaje.style.color = color;
  }
});
