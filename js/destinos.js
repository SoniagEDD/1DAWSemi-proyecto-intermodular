document.addEventListener('DOMContentLoaded', () => {
  const tablaDestinos = document.getElementById('tablaDestinos');
<<<<<<< HEAD
  const btnFiltrarDestinos = document.getElementById('btnFiltrarDestinos');
  const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
  const filtroPrecio = document.getElementById('filtroPrecio');
  const filtroPasaporte = document.getElementById('filtroPasaporte');

  // Variable global para guardar los datos que vengan del servidor
  let todosLosDestinos = [];

  // Provocamos un aviso en la consola para comprobar si lee el botón
  console.log('¿JS encuentra el botón de filtrar?:', btnFiltrarDestinos);

  // SI ESTAMOS EN LA PÁGINA DE LISTADO
  if (tablaDestinos) {
    cargarDestinos();

    // Evento para el botón de FILTRAR
    if (btnFiltrarDestinos) {
      btnFiltrarDestinos.addEventListener('click', (e) => {
        e.preventDefault(); // ??? Evita cualquier recarga extraña
        console.log('¡Has hecho clic en Filtrar!');
        aplicarFiltros();
      });
    }

    // Evento para el botón de LIMPIAR
    if (btnLimpiarFiltros) {
      btnLimpiarFiltros.addEventListener('click', (e) => {
        e.preventDefault();
        filtroPrecio.value = '';
        filtroPasaporte.value = 'todos';
        pintarTabla(todosLosDestinos);
      });
    }
  }

  // Petición al servidor para traer los destinos
  async function cargarDestinos() {
    try {
      const res = await fetch('http://localhost:8080/api/destino');
      if (!res.ok) throw new Error('Error en el servidor');

      todosLosDestinos = await res.json();
      console.log('Datos cargados del servidor:', todosLosDestinos);
      pintarTabla(todosLosDestinos);
=======
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
>>>>>>> origin/develop
    } catch (error) {
      console.error('Fallo al cargar destinos:', error);
    }
  }

<<<<<<< HEAD
  // La impresora de filas en la tabla
  function pintarTabla(listaDestinos) {
    tablaDestinos.innerHTML = '';

    if (listaDestinos.length === 0) {
      tablaDestinos.innerHTML = `<tr><td colspan="6" style="text-align:center; color:gray;">No se encontraron destinos con esos filtros.</td></tr>`;
      return;
    }

    listaDestinos.forEach((d) => {
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
      tablaDestinos.appendChild(fila);
    });
  }

  // La lógica del filtro
  function aplicarFiltros() {
    const precioMax = Number(filtroPrecio.value);
    const opcionPasaporte = filtroPasaporte.value;

    const listaFiltrada = todosLosDestinos.filter((d) => {
      const cumplePrecio = precioMax === 0 || d.precio <= precioMax;

      let cumplePasaporte = true;
      if (opcionPasaporte === 'si')
        cumplePasaporte = d.requierePasaporte === true;
      if (opcionPasaporte === 'no')
        cumplePasaporte = d.requierePasaporte === false;

      return cumplePrecio && cumplePasaporte;
    });

    console.log('Lista filtrada resultante:', listaFiltrada);
    pintarTabla(listaFiltrada);
  }

  window._refrescarTabla = cargarDestinos;
});

// Funciones globales de navegación (fuera del DOMContentLoaded)
function ModificarDestino(id) {
  window.location.href = `modificar-destino.html?id=${id}`;
}

async function eliminarDestino(id) {
  if (!confirm('¿Estás seguro?')) return;
=======
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

>>>>>>> origin/develop
  try {
    const res = await fetch(`http://localhost:8080/api/destino/${id}`, {
      method: 'DELETE'
    });
<<<<<<< HEAD
    if (res.ok) {
      alert('Eliminado');
      if (window._refrescarTabla) window._refrescarTabla();
    }
  } catch (error) {
    console.error(error);
=======

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
>>>>>>> origin/develop
  }
}
