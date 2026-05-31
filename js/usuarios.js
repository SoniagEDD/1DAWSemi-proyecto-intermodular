// ==========================================
// PARTE 1: CREACIÓN DE USUARIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const formCrear = document.getElementById('formUsuario');
  const mensaje = document.getElementById('mensaje');
  const checkboxPasaporte = document.getElementById('crearPasaporte');
  const fieldsPasaporte = document.getElementById('pasaporteFields');
  const tablaUsuarios = document.getElementById('tablaUsuarios'); // ?? Captura de la tabla de listado

  // Animación del pasaporte (Solo si existe en la página actual)
  if (checkboxPasaporte && fieldsPasaporte) {
    checkboxPasaporte.addEventListener('change', () => {
      if (checkboxPasaporte.checked) {
        fieldsPasaporte.classList.add('show');
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
      }
    });
  }

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
  if (formCrear) {
    formCrear.addEventListener('submit', async (e) => {
      e.preventDefault();

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

      let datosPasaporte = null;
      if (checkboxPasaporte && checkboxPasaporte.checked) {
        datosPasaporte = {
          numero: document.getElementById('numero').value,
          paisExpedicion: document.getElementById('pais_expedicion').value,
          fechaCaducidad: document.getElementById('fecha_caducidad').value
        };
      }

      const nuevoUsuario = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fechaNacimiento: document.getElementById('fecha_nacimiento').value,
        pasaporte: datosPasaporte
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

      const usuarios = await res.json();
      tablaUsuarios.innerHTML = '';

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
          </td>
        `;
        tablaUsuarios.appendChild(fila);
      });
    } catch (error) {
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

  try {
    const res = await fetch(`http://localhost:8080/api/usuario/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Usuario eliminado correctamente.');
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
