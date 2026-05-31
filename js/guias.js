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
      const nuevoGuia = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        especialidad: document.getElementById('especialidad').value,
        destino: {
          id: Number(selDestino.value)
        }
      };

      try {
        const res = await fetch('http://localhost:8080/api/guia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoGuia)
        });

        if (res.ok) {
          mostrarMensaje('Guía creado correctamente.', 'green');
          setTimeout(() => {
            window.location.href = '../pages/listado-guias.html';
          }, 1500);
        } else {
          mostrarMensaje('Error al guardar el guía en el servidor.', 'red');
        }
      } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor.', 'red');
      }
    });
  }

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
function modificarGuia(id) {
  window.location.href = `modificar-guia.html?id=${id}`;
}

async function eliminarGuiaReal(id) {
  if (!confirm('¿Seguro que deseas eliminar este guía?')) return;

  try {
    const res = await fetch(`http://localhost:8080/api/guia/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
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
  }
}
