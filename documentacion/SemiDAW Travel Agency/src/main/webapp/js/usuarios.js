// ==========================================
// PARTE 1: CREACIÓN DE USUARIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const formCrear = document.getElementById('formUsuario');
  const mensaje = document.getElementById('mensaje');

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

      // Recogemos únicamente los datos básicos del usuario
      const nuevoUsuario = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento')
          ? document.getElementById('fecha_nacimiento').value
          : null
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

  if (id && formModificar) {
    cargarUsuario(id);
  }

  async function cargarUsuario(id) {
    try {
      const res = await fetch(`http://localhost:8080/api/usuario/${id}`);
      if (!res.ok) throw new Error('Error al obtener usuario');
      const usuario = await res.json();

      // Rellenamos el HTML con los datos directos del usuario
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
        usuario.fecha_nacimiento
      ) {
        document.getElementById('fecha_nacimiento').value =
          usuario.fecha_nacimiento;
      }
    } catch (error) {
      if (mensaje) {
        mensaje.textContent = 'Error cargando usuario de la base de datos.';
        mensaje.style.color = 'red';
      }
    }
  }

  if (formModificar) {
    formModificar.addEventListener('submit', async (e) => {
      e.preventDefault();

      const usuarioEditado = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento')
          ? document.getElementById('fecha_nacimiento').value
          : null
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

        // Renderizado simplificado sin columnas ni celdas de pasaportes
        fila.innerHTML = `
          <td>${u.id}</td>
          <td>${u.nombre} ${u.apellidos || ''}</td>
          <td>${u.email}</td>
          <td>${u.telefono}</td>
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
