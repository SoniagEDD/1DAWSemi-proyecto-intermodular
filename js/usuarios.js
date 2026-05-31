// ==========================================
// PARTE 1: CREACIÓN DE USUARIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const formCrear = document.getElementById('formUsuario');
  const mensaje = document.getElementById('mensaje');
  const checkboxPasaporte = document.getElementById('crearPasaporte');
  const fieldsPasaporte = document.getElementById('pasaporteFields');
<<<<<<< HEAD
  const tablaUsuarios = document.getElementById('tablaUsuarios'); // ?? Captura de la tabla de listado
=======
>>>>>>> origin/develop

  // Animación del pasaporte (Solo si existe en la página actual)
  if (checkboxPasaporte && fieldsPasaporte) {
    checkboxPasaporte.addEventListener('change', () => {
      if (checkboxPasaporte.checked) {
        fieldsPasaporte.classList.add('show');
<<<<<<< HEAD
        document.getElementById('numero').required = true;
        document.getElementById('pais_expedicion').required = true;
        document.getElementById('fecha_caducidad').required = true;
      } else {
        fieldsPasaporte.classList.remove('show');
        const camposPasaporte = fieldsPasaporte.querySelectorAll('input');
        camposPasaporte.forEach((input) => {
          input.required = false;
          input.value = '';
          input.style.borderColor = '';
          if (
            input.nextElementSibling &&
            input.nextElementSibling.classList.contains('Aviso')
          ) {
            input.nextElementSibling.textContent = '';
          }
        });
=======
      } else {
        fieldsPasaporte.classList.remove('show');
>>>>>>> origin/develop
      }
    });
  }

<<<<<<< HEAD
  // VALIDACIÓN CONTINUA: Mientras el usuario escribe, quitamos el error
  const todosLosInputs = document.querySelectorAll('#formUsuario input');
  todosLosInputs.forEach((input) => {
    input.addEventListener('input', () => {
      const avisoBox = input.nextElementSibling;
      if (
        avisoBox &&
        avisoBox.classList.contains('Aviso') &&
        input.value.trim() !== ''
      ) {
        avisoBox.textContent = '';
        input.style.borderColor = '';
      }
    });
  });

  // CONTROL DEL SUBMIT (Formulario de alta)
=======
>>>>>>> origin/develop
  if (formCrear) {
    formCrear.addEventListener('submit', async (e) => {
      e.preventDefault();

<<<<<<< HEAD
      const todosLosAvisos = formCrear.querySelectorAll('.Aviso');
      todosLosAvisos.forEach((aviso) => (aviso.textContent = ''));
      todosLosInputs.forEach((input) => (input.style.borderColor = ''));

      if (!formCrear.checkValidity()) {
        const inputsCampos = formCrear.querySelectorAll('input');
        inputsCampos.forEach((input) => {
          const avisoBox = input.nextElementSibling;
          if (input.required && input.value.trim() === '') {
            if (avisoBox && avisoBox.classList.contains('Aviso')) {
              avisoBox.textContent = 'Este campo es obligatorio.';
              avisoBox.style.color = 'red';
              input.style.borderColor = 'red';
            }
          }
        });

        if (mensaje) {
          mensaje.textContent =
            'Por favor, rellena todos los datos requeridos.';
          mensaje.style.color = 'red';
        }
        alert('Error en el envío: Faltan datos en el formulario');
        return;
      }

=======
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
>>>>>>> origin/develop
      let datosPasaporte = null;
      if (checkboxPasaporte && checkboxPasaporte.checked) {
        datosPasaporte = {
          numero: document.getElementById('numero').value,
          paisExpedicion: document.getElementById('pais_expedicion').value,
          fechaCaducidad: document.getElementById('fecha_caducidad').value
        };
      }

<<<<<<< HEAD
=======
      // Armamos el objeto usuario definitivo para enviar al backend
>>>>>>> origin/develop
      const nuevoUsuario = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
<<<<<<< HEAD
        fechaNacimiento: document.getElementById('fecha_nacimiento').value,
        pasaporte: datosPasaporte
=======
        fechaNacimiento: document.getElementById('fecha_nacimiento').value, // CORREGIDO: Añadido .value
        pasaporte: datosPasaporte // CORREGIDO: Envía el objeto limpio o null
>>>>>>> origin/develop
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
<<<<<<< HEAD

  // ==========================================
  // PARTE 2: CARGAR LISTADO DE USUARIOS (GET)
  // ==========================================
  if (tablaUsuarios) {
    cargarListadoUsuarios();
  }

  async function cargarListadoUsuarios() {
    try {
      const res = await fetch('http://localhost:8080/api/usuario');
      if (!res.ok) throw new Error();
=======
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
>>>>>>> origin/develop

      const usuarios = await res.json();
      tablaUsuarios.innerHTML = '';

<<<<<<< HEAD
      if (usuarios.length === 0) {
        tablaUsuarios.innerHTML =
          '<tr><td colspan="6" style="text-align:center; color: gray;">No hay usuarios registrados.</td></tr>';
        return;
      }

      usuarios.forEach((u) => {
        const fila = document.createElement('tr');

        // Comprobamos de forma segura si tiene pasaporte asignado
        const infoPasaporte = u.pasaporte
          ? ` ${u.pasaporte.numero} (${u.pasaporte.paisExpedicion || 'Desconocido'})`
          : 'No tiene';

        fila.innerHTML = `
          <td>${u.id}</td>
          <td>${u.nombre} ${u.apellidos}</td>
          <td>${u.email}</td>
          <td>${u.telefono || '---'}</td>
          <td>${infoPasaporte}</td>
          <td>
            <button class="btn btn-editar" onclick="modificarUsuario(${u.id})">Modificar</button>
            <button class="btn btn-eliminar" onclick="eliminarUsuarioReal(${u.id})">Eliminar</button>
=======
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
>>>>>>> origin/develop
          </td>
        `;
        tablaUsuarios.appendChild(fila);
      });
    } catch (error) {
<<<<<<< HEAD
      console.error('Error cargando usuarios:', error);
      if (mensaje) {
        mensaje.textContent =
          'Error cargando la lista de usuarios del servidor.';
        mensaje.style.color = 'red';
      }
    }
  }

  // Guardamos la referencia para usarla desde fuera tras el borrado
  window._recargarTablaUsuarios = cargarListadoUsuarios;
});

// ==========================================
// PARTE 3: FUNCIONES GLOBALES (Acciones)
// ==========================================
function modificarUsuario(id) {
  window.location.href = `modificar-usuario.html?id=${id}`;
}

async function eliminarUsuarioReal(id) {
  if (!confirm('¿Seguro que deseas eliminar este usuario de forma permanente?'))
    return;
=======
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
>>>>>>> origin/develop

  try {
    const res = await fetch(`http://localhost:8080/api/usuario/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Usuario eliminado correctamente.');
<<<<<<< HEAD
      if (window._recargarTablaUsuarios) {
        window._recargarTablaUsuarios(); // Refresca la tabla dinámicamente sin reiniciar pestaña
      } else {
        location.reload();
      }
    } else {
      alert('No se pudo eliminar el usuario en el servidor.');
    }
  } catch (error) {
    console.error('Error al borrar:', error);
    alert('Error de conexión con el servidor.');
  }
}
// ==========================================
// PARTE 4: MODIFICAR USUARIO (Carga inicial y PUT)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const formModificar = document.getElementById('formModificarUsuario');
  const checkboxPasaporte = document.getElementById('crearPasaporte');
  const fieldsPasaporte = document.getElementById('pasaporteFields');
  const mensajeModificar = document.getElementById('mensaje');

  // Si no estamos en la pantalla de modificar, frenamos la ejecución de este bloque
  if (!formModificar) return;

  // 1. ?????? CAPTURAMOS EL ID DE LA URL (Ej: ?id=2)
  const params = new URLSearchParams(window.location.search);
  const idUsuario = params.get('id');

  if (!idUsuario) {
    if (mensajeModificar) {
      mensajeModificar.textContent =
        'No se ha detectado ningún ID de usuario para editar.';
      mensajeModificar.style.color = 'red';
    }
    return;
  }

  // ========================================================
  // CONTROL DEL DESPLEGABLE DEL PASAPORTE (Animación y Required)
  // ========================================================
  if (checkboxPasaporte && fieldsPasaporte) {
    checkboxPasaporte.addEventListener('change', () => {
      if (checkboxPasaporte.checked) {
        fieldsPasaporte.classList.add('show');
        establecerRequiredPasaporte(true);
      } else {
        fieldsPasaporte.classList.remove('show');
        establecerRequiredPasaporte(false);
        limpiarCamposPasaporte();
      }
    });
  }

  // 2. ?? CARGA AUTOMÁTICA DE LOS DATOS DE ORIGEN (GET)
  cargarDatosOrigen();

  async function cargarDatosOrigen() {
    try {
      // Pedimos al backend el usuario específico usando su ID
      const res = await fetch(`http://localhost:8080/api/usuario/${idUsuario}`);
      if (!res.ok) throw new Error('No se pudo obtener el usuario');

      const usuario = await res.json();

      // Inyectamos los datos de origen directamente en los inputs del HTML
      document.getElementById('nombre').value = usuario.nombre || '';
      document.getElementById('apellidos').value = usuario.apellidos || '';
      document.getElementById('email').value = usuario.email || '';
      document.getElementById('telefono').value = usuario.telefono || '';
      document.getElementById('fecha_nacimiento').value =
        usuario.fechaNacimiento || '';

      // ?? ¿Tiene pasaporte en la base de datos?
      if (usuario.pasaporte) {
        // Marcamos el checkbox automáticamente
        checkboxPasaporte.checked = true;
        // Desplegamos la sección aplicando la clase de la animación
        fieldsPasaporte.classList.add('show');

        // Rellenamos los campos ocultos del pasaporte con sus datos reales
        document.getElementById('numero').value =
          usuario.pasaporte.numero || '';
        document.getElementById('pais_expedicion').value =
          usuario.pasaporte.paisExpedicion || '';
        document.getElementById('fecha_caducidad').value =
          usuario.pasaporte.fechaCaducidad || '';

        // Activamos los campos obligatorios del pasaporte
        establecerRequiredPasaporte(true);
      }
    } catch (error) {
      console.error('Error cargando datos de origen:', error);
      if (mensajeModificar) {
        mensajeModificar.textContent =
          'Error al conectar con el servidor para recuperar los datos de origen.';
        mensajeModificar.style.color = 'red';
      }
    }
  }

  // Funciones auxiliares de control
  function establecerRequiredPasaporte(valor) {
    document.getElementById('numero').required = valor;
    document.getElementById('pais_expedicion').required = valor;
    document.getElementById('fecha_caducidad').required = valor;
  }

  function limpiarCamposPasaporte() {
    const inputs = fieldsPasaporte.querySelectorAll('input');
    inputs.forEach((input) => {
      input.value = '';
      input.style.borderColor = '';
      if (
        input.nextElementSibling &&
        input.nextElementSibling.classList.contains('Aviso')
      ) {
        input.nextElementSibling.textContent = '';
      }
    });
  }

  // VALIDACIÓN CONTINUA: Quita bordes rojos mientras el usuario corrige datos
  const inputsModificar = formModificar.querySelectorAll('input');
  inputsModificar.forEach((input) => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        input.style.borderColor = '';
      }
    });
  });

  // ==========================================
  // 3. ENVIAR LOS CAMBIOS AL SERVIDOR (PUT)
  // ==========================================
  formModificar.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpieza de avisos visuales previos
    inputsModificar.forEach((input) => (input.style.borderColor = ''));

    // Validación nativa de campos obligatorios
    if (!formModificar.checkValidity()) {
      inputsModificar.forEach((input) => {
        if (input.required && input.value.trim() === '') {
          input.style.borderColor = 'red';
        }
      });
      alert('Por favor, rellena todos los campos obligatorios correctamente.');
      return;
    }

    // Estructuramos el objeto pasaporte si la casilla sigue marcada
    let datosPasaporte = null;
    if (checkboxPasaporte && checkboxPasaporte.checked) {
      datosPasaporte = {
        numero: document.getElementById('numero').value,
        paisExpedicion: document.getElementById('pais_expedicion').value,
        fechaCaducidad: document.getElementById('fecha_caducidad').value
      };
    }

    // Juntamos el JSON completo con el ID incluido para actualizar
    const usuarioModificado = {
      id: Number(idUsuario),
      nombre: document.getElementById('nombre').value,
      apellidos: document.getElementById('apellidos').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      fechaNacimiento: document.getElementById('fecha_nacimiento').value,
      pasaporte: datosPasaporte
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/usuario/${idUsuario}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuarioModificado)
        }
      );

      if (res.ok) {
        alert('¡Usuario modificado correctamente!');
        window.location.href = 'usuario-listado.html';
      } else {
        if (mensajeModificar) {
          mensajeModificar.textContent =
            'El servidor rechazó la actualización.';
          mensajeModificar.style.color = 'red';
        }
      }
    } catch (error) {
      console.error('Error ejecutando PUT:', error);
      alert('Error de red al intentar actualizar.');
    }
  });
});
=======
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
>>>>>>> origin/develop
