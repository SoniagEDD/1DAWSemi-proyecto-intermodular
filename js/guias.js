<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
  const selDestino = document.getElementById('destino');
  const form = document.getElementById('formGuia');
  const mensajeGeneral = document.getElementById('mensaje');
  const tablaGuias = document.getElementById('tablaGuias');
  const todosLosInputs = document.querySelectorAll(
    '#formGuia input, #formGuia select'
  );

  // 1. CARGAR DESTINOS EN EL DESPLEGABLE (Página de Crear)
  if (selDestino) {
    cargarDestinosReal();
  }

  async function cargarDestinosReal() {
    try {
      const res = await fetch('http://localhost:8080/api/destino');
      selDestino.innerHTML = '<option value="">Seleccione un destino</option>';

      if (!res.ok) throw new Error();

      const destinosBDD = await res.json();
      destinosBDD.forEach((d) => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.ciudad}, ${d.pais}`;
        selDestino.appendChild(opt);
      });
    } catch (error) {
      console.error('Error cargando destinos:', error);
      selDestino.innerHTML =
        '<option value="">No se pudieron cargar destinos</option>';
    }
  }

  // 2. VALIDACIÓN EN TIEMPO REAL (Limpia los cartelitos rojos mientras el usuario escribe)
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

  // 3. CREAR UN NUEVO GUÍA (POST con validación exhaustiva)
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Limpiamos avisos anteriores
      const todosLosAvisos = form.querySelectorAll('.Aviso');
      todosLosAvisos.forEach((aviso) => (aviso.textContent = ''));
      todosLosInputs.forEach((input) => (input.style.borderColor = ''));

      // Comprobación de campos vacíos
      if (!form.checkValidity()) {
        todosLosInputs.forEach((input) => {
          const avisoBox = input.nextElementSibling;
          if (input.required && input.value.trim() === '') {
            if (avisoBox && avisoBox.classList.contains('Aviso')) {
              avisoBox.textContent = 'Este campo es obligatorio.';
              avisoBox.style.color = 'red';
              input.style.borderColor = 'red';
            }
          }
        });

        mostrarMensaje(
          'Todos los campos son obligatorios. Por favor, rellénalos.',
          'red'
        );
        alert('Error en el envío: Faltan datos obligatorios');
        return;
      }

      // Estructuramos el JSON respetando la relación de objetos de Spring Boot / Backend
=======
// ==========================================
// 1. CREACIÓN Y LISTADO GENERAL DE GUÍAS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const selDestino = document.getElementById('destino');
  const formGuia = document.getElementById('formGuia');
  const tablaGuias = document.getElementById('tablaGuias');
  const mensaje = document.getElementById('mensaje');

  // Si existe el select, cargamos los destinos (los dejamos simulados como pides)
  if (selDestino) {
    const destinos = [
      { id: 10, ciudad: 'Roma' },
      { id: 11, ciudad: 'Tokio' }
    ];
    selDestino.innerHTML =
      '<option value="">-- Selecciona un destino --</option>';
    destinos.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.ciudad;
      selDestino.appendChild(opt);
    });
  }

  // Si existe la tabla, cargamos los guías reales de la Base de Datos
  if (tablaGuias) {
    cargarGuias();
  }

  async function cargarGuias() {
    try {
      const res = await fetch('http://localhost:8080/api/guia');
      if (!res.ok) throw new Error('Error al conectar con el servidor');

      const guias = await res.json();
      tablaGuias.innerHTML = '';

      guias.forEach((g) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${g.id}</td>
          <td>${g.nombre} ${g.apellidos || ''}</td>
          <td>${g.especialidad}</td>
          <td>${g.idDestino || 'Sin asignar'}</td>
          <td>
              <button class="btn btn-editar" onclick="modificarGuia(${g.id})">Modificar</button>
              <button class="btn btn-eliminar" onclick="eliminarGuia(${g.id})">Eliminar</button>
          </td>
        `;
        tablaGuias.appendChild(fila);
      });
    } catch (error) {
      if (mensaje) {
        mensaje.textContent = 'Error cargando guías de la base de datos.';
        mensaje.style.color = 'red';
      }
      console.error(error);
    }
  }

  // Evento para CREAR un nuevo guía (POST real)
  if (formGuia) {
    formGuia.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!formGuia.checkValidity()) {
        mostrarMensaje('Todos los campos son obligatorios.', 'red');
        return;
      }

>>>>>>> origin/develop
      const nuevoGuia = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        especialidad: document.getElementById('especialidad').value,
<<<<<<< HEAD
        destino: {
          id: Number(selDestino.value)
        }
=======
        idDestino:
          selDestino && selDestino.value ? parseInt(selDestino.value) : null
>>>>>>> origin/develop
      };

      try {
        const res = await fetch('http://localhost:8080/api/guia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoGuia)
        });

        if (res.ok) {
<<<<<<< HEAD
          mostrarMensaje('Guía creado correctamente.', 'green');
          setTimeout(() => {
            window.location.href = '../pages/listado-guias.html';
          }, 1500);
        } else {
          mostrarMensaje('Error al guardar el guía en el servidor.', 'red');
        }
      } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor.', 'red');
=======
          alert('¡Guía creado correctamente!');
          window.location.href = 'listado-guias.html';
        } else {
          mostrarMensaje('Error al guardar en el servidor.', 'red');
        }
      } catch (error) {
        console.error(error);
>>>>>>> origin/develop
      }
    });
  }

<<<<<<< HEAD
  // 4. CARGAR EL LISTADO DE GUÍAS (Página de Listado)
  if (tablaGuias) {
    cargarListadoGuias();
  }

  async function cargarListadoGuias() {
    try {
      const res = await fetch('http://localhost:8080/api/guia');
      if (!res.ok) throw new Error();

      const guias = await res.json();
      tablaGuias.innerHTML = '';

      if (guias.length === 0) {
        tablaGuias.innerHTML =
          '<tr><td colspan="5" style="text-align:center; color: gray;">No hay guías registrados.</td></tr>';
        return;
      }

      guias.forEach((g) => {
        const fila = document.createElement('tr');

        // ?? LEEMOS DIRECTAMENTE LA PROPIEDAD idDestino QUE VEMOS EN CONSOLA
        let destinoTexto = 'Sin asignar';

        if (g.idDestino) {
          destinoTexto = `Destino ID: ${g.idDestino}`;
        }

        fila.innerHTML = `
          <td>${g.id}</td>
          <td>${g.nombre} ${g.apellidos}</td>
          <td>${g.especialidad}</td>
          <td>${destinoTexto}</td>
          <td>
            <button class="btn btn-editar" onclick="modificarGuia(${g.id})">Modificar</button>
            <button class="btn btn-eliminar" onclick="eliminarGuiaReal(${g.id})">Eliminar</button>
          </td>
        `;
        tablaGuias.appendChild(fila);
      });
    } catch (error) {
      console.error('Error listando guías:', error);
      if (mensajeGeneral) {
        mensajeGeneral.textContent = 'Error cargando guías desde el servidor.';
        mensajeGeneral.style.color = 'red';
      }
    }
  }

  function mostrarMensaje(texto, color) {
    if (mensajeGeneral) {
      mensajeGeneral.textContent = texto;
      mensajeGeneral.style.color = color;
    }
  }

  // Guardamos referencia limpia para las recargas del DELETE
  window._recargarTablaGuias = cargarListadoGuias;
});

// 5. FUNCIONES GLOBALES (Fuera de los bloques de carga aislados)
=======
  function mostrarMensaje(texto, color) {
    if (mensaje) {
      mensaje.textContent = texto;
      mensaje.style.color = color;
    }
  }
});

// ==========================================
// 2. EDICIÓN Y MODIFICACIÓN DE UN GUÍA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const idGuia = params.get('id');
  const formModificar = document.getElementById('formModificarGuia');
  const mensaje = document.getElementById('mensaje');
  const selDestino = document.getElementById('destino');

  if (formModificar && idGuia) {
    // Cargar destinos en el select de la pantalla de modificar
    if (selDestino) {
      const destinos = [
        { id: 10, ciudad: 'Roma' },
        { id: 11, ciudad: 'Tokio' }
      ];
      destinos.forEach((d) => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.ciudad;
        selDestino.appendChild(opt);
      });
    }

    cargarGuiaAlFormulario(idGuia);

    formModificar.addEventListener('submit', async (e) => {
      e.preventDefault();

      const guiaActualizado = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        especialidad: document.getElementById('especialidad').value,
        idDestino:
          selDestino && selDestino.value ? parseInt(selDestino.value) : null
      };

      try {
        const res = await fetch(`http://localhost:8080/api/guia/${idGuia}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guiaActualizado)
        });

        if (res.ok) {
          alert('Guía modificado correctamente.');
          window.location.href = 'listado-guias.html';
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  async function cargarGuiaAlFormulario(id) {
    try {
      const res = await fetch(`http://localhost:8080/api/guia/${id}`);
      const guia = await res.json();

      document.getElementById('nombre').value = guia.nombre || '';
      document.getElementById('apellidos').value = guia.apellidos || '';
      document.getElementById('especialidad').value = guia.especialidad || '';
      if (selDestino) selDestino.value = guia.idDestino || '';
    } catch (error) {
      console.error(error);
    }
  }
});

// ==========================================
// 3. FUNCIONES GLOBALES (BOTONES DE LA TABLA)
// ==========================================
>>>>>>> origin/develop
function modificarGuia(id) {
  window.location.href = `modificar-guia.html?id=${id}`;
}

<<<<<<< HEAD
async function eliminarGuiaReal(id) {
=======
async function eliminarGuia(id) {
  // <-- Arreglado a ASYNC
>>>>>>> origin/develop
  if (!confirm('¿Seguro que deseas eliminar este guía?')) return;

  try {
    const res = await fetch(`http://localhost:8080/api/guia/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
<<<<<<< HEAD
      alert('Guía eliminado correctamente.');
      if (window._recargarTablaGuias) {
        window._recargarTablaGuias();
      } else {
        location.reload();
      }
    } else {
      alert('No se pudo eliminar el guía en el servidor.');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error de conexión.');
=======
      alert('Guía eliminado con éxito.');
      location.reload();
    } else {
      alert('Error al intentar eliminar el guía.');
    }
  } catch (error) {
    console.error('Error:', error);
>>>>>>> origin/develop
  }
}
