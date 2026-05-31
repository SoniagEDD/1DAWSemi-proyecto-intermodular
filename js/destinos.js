document.addEventListener('DOMContentLoaded', () => {
  const tablaDestinos = document.getElementById('tablaDestinos');
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
    } catch (error) {
      console.error('Fallo al cargar destinos:', error);
    }
  }

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
  try {
    const res = await fetch(`http://localhost:8080/api/destino/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      alert('Eliminado');
      if (window._refrescarTabla) window._refrescarTabla();
    }
  } catch (error) {
    console.error(error);
  }
}
