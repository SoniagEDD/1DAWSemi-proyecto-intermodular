document.addEventListener('DOMContentLoaded', () => {
  const tablaDestinos = document.getElementById('tablaDestinos');
  const formDestino = document.getElementById('formDestino');
  const formModificar = document.getElementById('formModificarDestino');
  const mensaje = document.getElementById('mensaje');

  // Si estamos en la página de listado, cargamos la tabla
  if (tablaDestinos) {
    cargarDestinos();
  }

  async function cargarDatosParaModificar() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      console.log('No hay ID en la URL');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/destino/${id}`);

      if (!res.ok) {
        throw new Error('Error obteniendo destino');
      }

      const destino = await res.json();

      console.log(destino);

      document.getElementById('ciudad').value = destino.ciudad || '';

      document.getElementById('pais').value = destino.pais || '';

      document.getElementById('precio').value = destino.precio || 0;

      document.getElementById('requierePasaporte').checked =
        destino.requierePasaporte || false;
    } catch (error) {
      console.error('Error cargando destino para modificar', error);
    }
  }
  // --- MODIFICAR DESTINO (PUT) ---
  // Si estamos en la página de modificar
  const params = new URLSearchParams(window.location.search);
  const idDestino = params.get('id');

  if (formModificar && idDestino) {
    cargarDatosParaModificar();

    // --- MODIFICAR DESTINO (PUT) ---
    formModificar.addEventListener('submit', async (e) => {
      e.preventDefault();

      const destinoModificado = {
        ciudad: document.getElementById('ciudad').value,

        pais: document.getElementById('pais').value,

        precio: Number(document.getElementById('precio').value),

        requierePasaporte: document.getElementById('requierePasaporte').checked
      };

      try {
        const res = await fetch(
          `http://localhost:8080/api/destino/${idDestino}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(destinoModificado)
          }
        );

        if (res.ok) {
          alert('Destino modificado correctamente');

          window.location.href = 'listado-destinos.html';
        } else {
          alert('Error modificando destino');
        }
      } catch (error) {
        console.error(error);

        alert('Error de conexión');
      }
    });
  }
  // Si estamos en la página de modificar
  //params = new URLSearchParams(window.location.search);
  //idDestino = params.get('id');
  if (formModificar && idDestino) {
    cargarDatosParaModificar();
  }

  // --- FUNCIÓN: LISTAR DESTINOS ---
  async function cargarDestinos() {
    try {
      const res = await fetch('http://localhost:8080/api/destino');
      if (!res.ok) throw new Error('Error 404 o 500 en el servidor');

      const destinos = await res.json();
      const tabla = document.getElementById('tablaDestinos');

      if (tabla) {
        tabla.innerHTML = '';
        destinos.forEach((d) => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${d.id}</td>
            <td>${d.ciudad}</td>
            <td>${d.pais}</td>
            <td>${d.precio} €</td>
            <td>${d.requierePasaporte ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn btn-modificar" onclick="ModificarDestino(${d.id})">Modificar</button>
                <button class="btn btn-eliminar" onclick="eliminarDestino(${d.id})">Eliminar</button>
            </td>`;
          tabla.appendChild(fila);
        });
      }
    } catch (error) {
      console.error('Fallo al cargar destinos:', error);
    }
  }

  // --- FUNCIÓN: CREAR (POST) ---
  if (formDestino) {
    formDestino.addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const nuevo = {
          ciudad: document.getElementById('ciudad').value,
          pais: document.getElementById('pais').value,
          precio: Number(document.getElementById('precio').value),
          requierePasaporte:
            document.getElementById('requierePasaporte').checked
        };

        const res = await fetch('http://localhost:8080/api/destino', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevo)
        });

        if (res.ok) {
          alert('Destino guardado con éxito');
          window.location.href = 'listado-destinos.html';
        } else {
          alert('Ha habido un error en el servidor');
        }
      } catch (error) {
        console.log('Error en la petición HTTP: ', error);
        alert('No se pudo conectar con el servidor.');
      }
    });
  }

  // Guardamos una referencia interna para poder usarla desde las funciones globales de abajo
  window._refrescarTabla = cargarDestinos;
});

// ==========================================
//  FUNCIONES GLOBALES (FUERA DEL DOMCONTENTLOADED)
// ==========================================

// --- ACCIÓN DETALLE ---
function verDetalle(id) {
  window.location.href = `detalle-destino.html?id=${id}`;
}

// --- ACCIÓN MODIFICAR ---
function ModificarDestino(id) {
  // Asegúrate de que tu archivo HTML se llama exactamente 'modificar-destino.html'
  window.location.href = `modificar-destino.html?id=${id}`;
}

// --- ACCIÓN ELIMINAR ---
async function eliminarDestino(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este destino?')) {
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/destino/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Destino eliminado con éxito');
      // Llamamos a la referencia guardada para recargar la lista sin recargar la página completa
      if (window._refrescarTabla) {
        window._refrescarTabla();
      } else {
        location.reload();
      }
    } else {
      alert('Hubo un error en el servidor al intentar eliminar');
    }
  } catch (error) {
    console.error('Error en la petición DELETE:', error);
    alert('No se pudo conectar con el servidor para eliminar.');
  }
}
