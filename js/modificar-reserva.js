document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formModificarReserva');
  const mensaje = document.getElementById('mensaje');

  // 1. Obtener parámetros de la URL (para saber qué reserva editamos)
  const params = new URLSearchParams(window.location.search);
  const idUsuario = params.get('idUsuario');
  const idDestino = params.get('idDestino');

  // Si los IDs existen, podrías cargar los datos actuales aquí
  if (idUsuario && idDestino) {
    console.log(
      `Editando reserva del usuario ${idUsuario} al destino ${idDestino}`
    );
    // cargarDatosReserva(idUsuario, idDestino); // Función para el futuro
  }

  // 2. Manejo del envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación básica de HTML5
    if (!form.checkValidity()) {
      mensaje.textContent =
        'Por favor, selecciona un nuevo destino y una fecha válida.';
      mensaje.style.color = 'red';
      return;
    }

    // 3. Recogida de datos
    const datosModificados = {
      idUsuario: idUsuario, // Obtenido de la URL
      nuevoDestino: document.getElementById('nuevoDestino').value,
      fechaViaje: document.getElementById('fecha').value
    };

    try {
      /* ENLACE CON EL BACKEND:
               Aquí deberás poner la URL de tu Servlet de Java cuando lo tengas listo.
               Ejemplo: 'http://localhost:8080/AgenciaViajes/ModificarReservaServlet'
            */
      const urlBackend = '#';

      /* SIMULACIÓN DE ENVÍO (POST o PUT)
               Cambiamos el alert por un fetch real cuando el Servlet esté operativo.
            */
      console.log('Enviando datos al servidor:', datosModificados);

      // Simulación de respuesta positiva
      mensaje.textContent = 'Enviando cambios al servidor...';
      mensaje.style.color = 'blue';

      // Simulación de retraso de red
      setTimeout(() => {
        mensaje.textContent = '¡Reserva actualizada con éxito!';
        mensaje.style.color = 'green';

        // Opcional: Redirigir al listado tras 2 segundos
        // window.location.href = '../pages/listado-reservas.html';
      }, 1500);

      /* CÓDIGO REAL PARA CUANDO TENGAS EL SERVLET:
            const respuesta = await fetch(urlBackend, {
                method: 'POST', // O PUT según vuestro diseño
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosModificados)
            });

            if (respuesta.ok) {
                mensaje.textContent = 'Reserva modificada correctamente.';
                mensaje.style.color = 'green';
            } else {
                throw new Error('Error en el servidor');
            }
            */
    } catch (error) {
      mensaje.textContent = 'Error al conectar con el servidor Java.';
      mensaje.style.color = 'red';
      console.error(error);
    }
  });
});
