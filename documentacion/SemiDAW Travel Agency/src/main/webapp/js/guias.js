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

      const nuevoGuia = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        especialidad: document.getElementById('especialidad').value,
        idDestino:
          selDestino && selDestino.value ? parseInt(selDestino.value) : null
      };

      try {
        const res = await fetch('http://localhost:8080/api/guia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoGuia)
        });

        if (res.ok) {
          alert('¡Guía creado correctamente!');
          window.location.href = 'listado-guias.html';
        } else {
          mostrarMensaje('Error al guardar en el servidor.', 'red');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

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
function modificarGuia(id) {
  window.location.href = `modificar-guia.html?id=${id}`;
}

async function eliminarGuia(id) {
  // <-- Arreglado a ASYNC
  if (!confirm('¿Seguro que deseas eliminar este guía?')) return;

  try {
    const res = await fetch(`http://localhost:8080/api/guia/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Guía eliminado con éxito.');
      location.reload();
    } else {
      alert('Error al intentar eliminar el guía.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
