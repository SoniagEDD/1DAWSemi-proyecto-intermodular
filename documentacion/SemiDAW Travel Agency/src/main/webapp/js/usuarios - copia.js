// Parte 1

document.addEventListener('DOMContentLoaded', () => {
  const chkPasaporte = document.getElementById('crearPasaporte');
  const pasaporteFields = document.getElementById('pasaporteFields');
  const form = document.getElementById('formUsuario');
  const mensaje = document.getElementById('mensaje');

  // Mostrar/ocultar campos de pasaporte
  chkPasaporte.addEventListener('change', () => {
    pasaporteFields.classList.toggle('hidden', !chkPasaporte.checked);
  });

  // Validación adicional + mensaje
  // Dentro de vuestro archivo usuarios.js, en la parte del submit del form:
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      mensaje.textContent = 'Por favor, rellena todos los datos requeridos.';
      mensaje.style.color = 'red';
      return;
    }

    // Recogemos todos los campos del formulario
    const datosUsuario = {
      nombre: document.getElementById('nombre').value,
      apellidos: document.getElementById('apellidos').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
      // Si el checkbox est� marcado, enviamos los datos del pasaporte
      pasaporte: chkPasaporte.checked
        ? {
            numero: document.getElementById('numero').value,
            pais: document.getElementById('pais_expedicion').value,
            caducidad: document.getElementById('fecha_caducidad').value
          }
        : null
    };

    try {
      // La URL debe coincidir con la de vuestro servidor Tomcat y el nombre del proyecto
      const respuesta = await fetch(
        'http://localhost:8080/TuProyectoJava/UsuarioServlet',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosUsuario)
        }
      );

      if (respuesta.ok) {
        mensaje.textContent =
          '�Usuario registrado correctamente en la base de datos!';
        mensaje.style.color = 'green';
        form.reset();
        pasaporteFields.classList.add('hidden'); // Ocultamos campos de pasaporte tras �xito
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      mensaje.textContent = 'Error: No se pudo conectar con el servidor Java.';
      mensaje.style.color = 'red';
      console.error(error);
    }
  });
});

// Parte 2

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const form = document.getElementById('formModificarUsuario');
  const mensaje = document.getElementById('mensaje');

  const pasaporteFields = document.getElementById('pasaporteFields');
  const estadoPasaporte = document.getElementById('estadoPasaporte');
  const btnCrearPasaporte = document.getElementById('btnCrearPasaporte');

  if (id) {
    cargarUsuario(id);
  }

  async function cargarUsuario(id) {
    try {
      // Simulación: sustituir por fetch real
      // const res = await fetch(`/usuarios/${id}`);
      // const usuario = await res.json();

      const usuario = {
        nombre: 'Carlos',
        apellidos: 'Pérez Gómez',
        email: 'carlos@example.com',
        telefono: '654987321',
        fecha_nacimiento: '1990-05-12',
        pasaporte: null
      };

      document.getElementById('nombre').value = usuario.nombre;
      document.getElementById('apellidos').value = usuario.apellidos;
      document.getElementById('email').value = usuario.email;
      document.getElementById('telefono').value = usuario.telefono;
      document.getElementById('fecha_nacimiento').value =
        usuario.fecha_nacimiento;

      if (usuario.pasaporte) {
        estadoPasaporte.textContent = 'Este usuario tiene pasaporte.';
        pasaporteFields.classList.remove('hidden');

        document.getElementById('numero').value = usuario.pasaporte.numero;
        document.getElementById('pais_expedicion').value =
          usuario.pasaporte.pais;
        document.getElementById('fecha_caducidad').value =
          usuario.pasaporte.fecha_caducidad;
      } else {
        estadoPasaporte.textContent = 'Este usuario NO tiene pasaporte.';
        btnCrearPasaporte.classList.remove('hidden');
      }
    } catch (error) {
      mensaje.textContent = 'Error cargando usuario.';
      mensaje.style.color = 'red';
    }
  }

  btnCrearPasaporte.addEventListener('click', () => {
    pasaporteFields.classList.remove('hidden');
    btnCrearPasaporte.classList.add('hidden');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      mensaje.textContent = 'Revisa los campos obligatorios.';
      mensaje.style.color = 'red';
      return;
    }

    mensaje.textContent = 'Usuario actualizado correctamente (simulación).';
    mensaje.style.color = 'green';

    // Aquí iría el PUT real:
    // fetch(`/usuarios/${id}`, { method: "PUT", body: ... })
  });
});

// Parte 3

document.addEventListener('DOMContentLoaded', () => {
  const tablaUsuarios = document.getElementById('tablaUsuarios');
  const mensaje = document.getElementById('mensaje');

  // Si existe la tabla, estamos en listado-usuarios.html
  if (tablaUsuarios) {
    cargarUsuarios();
  }

  async function cargarUsuarios() {
    try {
      // Simulación: sustituir por fetch real
      // const res = await fetch("/usuarios");
      // const usuarios = await res.json();

      const usuarios = [
        {
          id: 1,
          nombre: 'Carlos Pérez',
          email: 'carlos@example.com',
          telefono: '654987321'
        },
        {
          id: 2,
          nombre: 'Ana López',
          email: 'ana@example.com',
          telefono: '612345678'
        }
      ];

      tablaUsuarios.innerHTML = '';

      usuarios.forEach((u) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
                    <td>${u.id}</td>
                    <td>${u.nombre}</td>
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
      mensaje.textContent = 'Error cargando usuarios.';
      mensaje.style.color = 'red';
    }
  }
});

// Funciones globales para botones
function editarUsuario(id) {
  window.location.href = `modificar-usuario.html?id=${id}`;
}

function eliminarUsuario(id) {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

  // Simulación de eliminación
  alert('Usuario eliminado (simulación).');

  // Aquí iría el DELETE real:
  // fetch(`/usuarios/${id}`, { method: "DELETE" }).then(...)
}

// Parte 4 animacion pasaporte

const checkbox = document.getElementById('crearPasaporte');
const fields = document.getElementById('pasaporteFields');

checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    fields.classList.add('show');
  } else {
    fields.classList.remove('show');
  }
});
