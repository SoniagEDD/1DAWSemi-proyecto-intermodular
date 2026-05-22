document.addEventListener('DOMContentLoaded', () => {
  const selDestino = document.getElementById('destino');
  const form = document.getElementById('formGuia');
  const mensaje = document.getElementById('mensaje');
  const tablaGuias = document.getElementById('tablaGuias');

  // 1. CARGAR DESTINOS EN EL DESPLEGABLE (Si el elemento existe en el HTML)
  if (selDestino) {
    cargarDestinosReal();
  }

  // Carga los destinos reales desde el backend y mantiene los básicos activos
  async function cargarDestinosReal() {
    try {
      const res = await fetch('http://localhost:8080/api/destino');

      selDestino.innerHTML = '<option value="">Seleccione un destino</option>';

      if (!res.ok) {
        throw new Error();
      }

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

  // 2. CREAR UN NUEVO GUÍA (POST)
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        mostrarMensaje(
          'Todos los campos son obligatorios. Por favor, rellénalos.',
          'red'
        );
        return;
      }

      const nuevoGuia = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        especialidad: document.getElementById('especialidad').value
        //  idDestino: parseInt(selDestino.value) || null
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

  // 3. CARGAR EL LISTADO DE GUÍAS (GET)
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
          '<tr><td colspan="5" style="text-align:center;">No hay guías registrados.</td></tr>';
        return;
      }

      guias.forEach((g) => {
        const fila = document.createElement('tr');
        const destinoTexto = g.idDestino
          ? `Destino ID: ${g.idDestino}`
          : 'Sin asignar';

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
      if (mensaje) {
        mensaje.textContent = 'Error cargando guías desde el servidor.';
        mensaje.style.color = 'red';
      }
    }
  }

  function mostrarMensaje(texto, color) {
    if (mensaje) {
      mensaje.textContent = texto;
      mensaje.style.color = color;
    }
  }
});

// 4. FUNCIONES GLOBALES (Modificar y Eliminar)
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
      location.reload();
    } else {
      alert('No se pudo eliminar el guía en el servidor.');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error de conexión.');
  }
}
