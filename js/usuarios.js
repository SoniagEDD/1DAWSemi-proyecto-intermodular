// ==========================================
// PARTE 1: CREACIÓN DE USUARIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const formCrear = document.getElementById('formUsuario');
  const mensaje = document.getElementById('mensaje');
  const checkboxPasaporte = document.getElementById('crearPasaporte');
  const fieldsPasaporte = document.getElementById('pasaporteFields');

  // Animación del pasaporte (Solo si existe en la página actual)
  if (checkboxPasaporte && fieldsPasaporte) {
    checkboxPasaporte.addEventListener('change', () => {
      if (checkboxPasaporte.checked) {
        fieldsPasaporte.classList.add('show');
      } else {
        fieldsPasaporte.classList.remove('show');
      }
    });
  }

  if (formCrear) {
    formCrear.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!formCrear.checkValidity()) {
        if (mensaje) {
          mensaje.textContent =
            'Por favor, rellena todos los datos personales.';
          mensaje.style.color = 'red';
        }
        alert('Error en el envío: datos inválidos.');
        return;
      }

      // Estructuramos el objeto pasaporte según si el checkbox está marcado o no
      let datosPasaporte = null;
      if (checkboxPasaporte && checkboxPasaporte.checked) {
        datosPasaporte = {
          numero: document.getElementById('numero').value,
          paisExpedicion: document.getElementById('pais_expedicion').value,
          fechaCaducidad: document.getElementById('fecha_caducidad').value
        };
      }

      // Armamos el objeto usuario definitivo para enviar al backend
      const nuevoUsuario = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fechaNacimiento: document.getElementById('fecha_nacimiento').value, // CORREGIDO: Añadido .value
        pasaporte: datosPasaporte // CORREGIDO: Envía el objeto limpio o null
      };

      try {
        const res = await fetch('http://localhost:8080/api/usuario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoUsuario)
        });

        if (res.ok) {
          alert('¡Usuario creado con éxito!');
          window.location.href = 'usuario-listado.html';
        } else {
          if (mensaje) {
            mensaje.textContent = 'Error al guardar el usuario en el servidor.';
            mensaje.style.color = 'red';
          }
        }
      } catch (error) {
        console.error('Error al guardar:', error);
      }
    });
  }
});

// ==========================================
// PARTE 2: MODIFICACIÓN DE USUARIO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const formModificar = document.getElementById('formModificarUsuario');
  const mensaje = document.getElementById('mensaje');

  // Elementos específicos del HTML de modificar
  const estadoPasaporte = document.getElementById('estadoPasaporte');
  const fieldsPasaporte = document.getElementById('pasaporteFields');
  const btnCrearPasaporte = document.getElementById('btnCrearPasaporte');

  // Variable para controlar si el usuario va a terminar guardando un pasaporte o no
  let quierePasaporte = false;

  if (id && formModificar) {
    cargarUsuario(id);
  }

  // Si el usuario no tiene pasaporte y clica en el botón "Crear pasaporte"
  if (btnCrearPasaporte && fieldsPasaporte) {
    btnCrearPasaporte.addEventListener('click', () => {
      fieldsPasaporte.style.display = 'block'; // Desplegamos los campos
      fieldsPasaporte.classList.remove('hidden');
      btnCrearPasaporte.style.display = 'none'; // Escondemos el botón para limpiar la vista
      quierePasaporte = true; // Marcamos que sí enviará pasaporte
      if (estadoPasaporte)
        estadoPasaporte.textContent = 'Añadiendo nuevo pasaporte...';
    });
  }

  async function cargarUsuario(id) {
    try {
      const res = await fetch(`http://localhost:8080/api/usuario/${id}`);
      if (!res.ok) throw new Error('Error al obtener usuario');
      const usuario = await res.json();

      // Rellenamos los campos básicos
      if (document.getElementById('nombre'))
        document.getElementById('nombre').value = usuario.nombre || '';
      if (document.getElementById('apellidos'))
        document.getElementById('apellidos').value = usuario.apellidos || '';
      if (document.getElementById('email'))
        document.getElementById('email').value = usuario.email || '';
      if (document.getElementById('telefono'))
        document.getElementById('telefono').value = usuario.telefono || '';

      if (
        document.getElementById('fecha_nacimiento') &&
        usuario.fechaNacimiento
      ) {
        document.getElementById('fecha_nacimiento').value =
          usuario.fechaNacimiento;
      }

      // LÓGICA DE CONTROL SEGÚN TU HTML:
      if (usuario.pasaporte && usuario.pasaporte.numero) {
        // CASO A: SI TIENE PASAPORTE
        quierePasaporte = true;
        if (estadoPasaporte)
          estadoPasaporte.textContent = 'Pasaporte actualmente asignado:';

        if (fieldsPasaporte) {
          fieldsPasaporte.style.display = 'block'; // Forzamos que se vea el desplegable
          fieldsPasaporte.classList.remove('hidden');
        }
        if (btnCrearPasaporte) {
          btnCrearPasaporte.style.display = 'none'; // No hace falta el botón de crear
        }

        // Rellenamos los inputs internos del pasaporte
        if (document.getElementById('numero'))
          document.getElementById('numero').value =
            usuario.pasaporte.numero || '';
        if (document.getElementById('pais_expedicion'))
          document.getElementById('pais_expedicion').value =
            usuario.pasaporte.paisExpedicion || '';
        if (document.getElementById('fecha_caducidad'))
          document.getElementById('fecha_caducidad').value =
            usuario.pasaporte.fechaCaducidad || '';
      } else {
        // CASO B: NO TIENE PASAPORTE
        quierePasaporte = false;
        if (estadoPasaporte)
          estadoPasaporte.textContent =
            'Este usuario no tiene pasaporte asignado.';
        if (fieldsPasaporte) fieldsPasaporte.style.display = 'none'; // Aseguramos que empiece oculto
        if (btnCrearPasaporte) {
          btnCrearPasaporte.style.display = 'inline-block'; // Mostramos el botón para permitir crearlo
          btnCrearPasaporte.classList.remove('hidden');
        }
      }
    } catch (error) {
      if (mensaje) {
        mensaje.textContent = 'Error cargando usuario de la base de datos.';
        mensaje.style.color = 'red';
      }
      console.error(error);
    }
  }

  if (formModificar) {
    formModificar.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Construimos el objeto pasaporte solo si ya existía o pulsó el botón de añadir
      let datosPasaporte = null;
      if (quierePasaporte) {
        datosPasaporte = {
          numero: document.getElementById('numero').value,
          paisExpedicion: document.getElementById('pais_expedicion').value,
          fechaCaducidad: document.getElementById('fecha_caducidad').value
        };
      }

      const usuarioEditado = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fechaNacimiento: document.getElementById('fecha_nacimiento')
          ? document.getElementById('fecha_nacimiento').value
          : null,
        pasaporte: datosPasaporte
      };

      try {
        const res = await fetch(`http://localhost:8080/api/usuario/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuarioEditado)
        });

        if (res.ok) {
          alert('¡Usuario actualizado correctamente!');
          window.location.href = 'usuario-listado.html';
        } else {
          if (mensaje) {
            mensaje.textContent = 'Error al actualizar en el servidor.';
            mensaje.style.color = 'red';
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
});
// ==========================================
// PARTE 3: LISTADO DE USUARIOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const tablaUsuarios = document.getElementById('tablaUsuarios');

  if (tablaUsuarios) {
    cargarUsuarios();
  }

  async function cargarUsuarios() {
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    const mensaje = document.getElementById('mensaje');

    try {
      const res = await fetch('http://localhost:8080/api/usuario');
      if (!res.ok) throw new Error('Error al conectar con el servidor');

      const usuarios = await res.json();
      tablaUsuarios.innerHTML = '';

      usuarios.forEach((u) => {
        const fila = document.createElement('tr');

        // COMPROBACIÓN DEL PASAPORTE: Si tiene objeto pasaporte, extraemos su número, si no, ponemos "No tiene"
        const textoPasaporte =
          u.pasaporte && u.pasaporte.numero ? u.pasaporte.numero : 'No tiene';

        fila.innerHTML = `
          <td>${u.id}</td>
          <td>${u.nombre} ${u.apellidos || ''}</td>
          <td>${u.email}</td>
          <td>${u.telefono}</td>
          <td><span class="badge-pasaporte">${textoPasaporte}</span></td>
          <td>
              <button class="btn btn-editar" onclick="editarUsuario(${u.id})">Modificar</button>
              <button class="btn btn-eliminar" onclick="eliminarUsuario(${u.id})">Eliminar</button>
          </td>
        `;
        tablaUsuarios.appendChild(fila);
      });
    } catch (error) {
      if (mensaje) {
        mensaje.textContent =
          'No se pudieron cargar los usuarios de la base de datos.';
        mensaje.style.color = 'red';
      }
      console.error('Error detallado:', error);
    }
  }
});

// Funciones de navegación globales
function editarUsuario(id) {
  window.location.href = `modificar-usuario.html?id=${id}`;
}

async function eliminarUsuario(id) {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

  try {
    const res = await fetch(`http://localhost:8080/api/usuario/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Usuario eliminado correctamente.');
      location.reload();
    } else {
      alert(
        'Error al eliminar: Es posible que este usuario esté asignado en una Reserva.'
      );
    }
  } catch (error) {
    console.error('Error en la petición DELETE:', error);
    alert('No se pudo conectar con el servidor.');
  }
}
