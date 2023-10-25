// Obtiene los items (nav)
const navItems = document.querySelectorAll('.nav-item'); // Selecciona todos los elementos con clase 'nav-item'
const lblAct = document.querySelector('.lblAct'); // Selecciona el elemento con clase 'lblAct'
const div = document.querySelector('.dashboard'); // Selecciona el elemento con clase 'dashboard'
const formLogin = document.querySelector('.login'); // Selecciona el elemento con clase 'login'
const pin = document.querySelector('#pin'); // Selecciona el elemento con el id 'pin'
const btnTransac = document.querySelector('#enviar'); // Selecciona el elemento con el id 'enviar'
const transacList = document.querySelector('.transacList'); // Selecciona el elemento con clase 'transacList'

let saldo = parseInt(localStorage.getItem("saldo")) || 333; // Obtiene el saldo almacenado en el localStorage o establece un valor predeterminado de 500
let historial = JSON.parse(localStorage.getItem("historial")) || []; // Obtiene el historial almacenado en el localStorage o establece un arreglo vacío

// sirve para validar el login
if (formLogin != null) {
  formLogin.onsubmit = function (e) {
    e.preventDefault();
    valor = pin.value;
    if(valor == null || valor.length == 0)
      swal("Ingresa tu pin", "", "error");
    else {
      if(isNaN(valor))
        swal("Tu pin es numérico", "", "error");
      else {
        if(valor == "777") {
          swal("Pin correcto", "", "success").then(() => {
            window.location = "dashboard.html"; // Redirige a la página "dashboard.html" si el PIN es correcto
          });
        } else
          swal("Pin incorrecto", "", "error");
      }
    }
  }
}

// Recorre todos los elementos 'nav-item'
navItems.forEach(navItem => {
  navItem.addEventListener('click', () => {
    // Quita la clase 'active' de todos los elementos
    navItems.forEach(item => item.querySelector('.nav-link').classList.remove('active'));
    // Si existe la clase 'active', la quita; de lo contrario, la agrega
    navItem.querySelector('.nav-link').classList.toggle('active');

    // Verifica el elemento seleccionado en la navegación
    switch (navItem.querySelector('.nav-link').textContent) {
      case 'Depósito':
        btnTransac.classList.add("depositar"); // Agrega la clase "depositar" al botón
        div.innerHTML = `<label for="formGroupExampleInput2" required class="form-label fw-bold lblAct">Nota</label>
            <input type="text" min="1" class="form-control" id="nota">
            <label for="formGroupExampleInput2" required class="form-label fw-bold lblAct">Monto a depositar</label>
            <input type="number" min="1" class="form-control" id="monto">
            <button type="submit" id="enviar" onclick="transactControl()" class="btn btn-primary  mt-3 bg-success">Enter</button>`;
        break;
      case 'Retiro':
        btnTransac.classList.remove("depositar"); // Quita la clase "depositar" del botón
        div.innerHTML = `<label for="nota" required class="form-label fw-bold lblAct">Nota</label>
            <input type="text" min="1" class="form-control" id="nota">
            <label for="monto" required class="form-label fw-bold lblAct">Monto a retirar</label>
            <input type="number" min="1" class="form-control" id="monto">
            <button type="submit" id="enviar" onclick="transactControl()"  class="btn btn-primary retirar mt-3 bg-success">Enter</button>`;
        break;
      case 'Consultar saldo':
        div.innerHTML = `<h1 class="text-center">El saldo disponible es: $${saldo}</h1>`;
        break;
      case 'Pago de servicios':
        div.innerHTML = `<ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Energía eléctrica
              <span class="badge bg-primary rounded-pill p-2 pagar" onclick="servicios(10, 'Energía eléctrica')">Pagar</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Agua potable
              <span class="badge bg-primary rounded-pill p-2 pagar" onclick="servicios(4, 'Agua potable')">Pagar</span>
            </li>
            <li class="list-group-item d-flex justify-content-between  align-items-center">
              Internet
              <span class="badge bg-primary rounded-pill p-2 pagar" onclick="servicios(60, 'Internet')">Pagar</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Telefonía
              <span class="badge bg-primary rounded-pill p-2 pagar" onclick="servicios(50, 'Línea fija y datos')">Pagar</span>
            </li>
          </ul>`;
        break;
    }
  });
});

// Obtener la fecha y hora actual
var fechaActual = new Date();

// Obtener los componentes de la fecha y hora actual
var año = fechaActual.getFullYear();
var mes = fechaActual.getMonth() + 1; // Los meses van de 0 a 11
var dia = fechaActual.getDate();
var hora = fechaActual.getHours();
var minutos = fechaActual.getMinutes();
var segundos = fechaActual.getSeconds();
var fechaHoraActual = dia + '/' + mes + '/' + año + ' ' + hora + ':' + minutos + ':' + segundos;

function servicios(monto, nota){
  monto = parseInt(monto);
  if (monto <= saldo) {
    saldo -= monto;
    historial.push({ tipo: "retiro", monto: monto, nota: nota });
    // Guarda los datos en local storage
    localStorage.setItem("saldo", saldo.toString());
    localStorage.setItem("historial", JSON.stringify(historial));

    swal("Transacción realizada correctamente", "", "success").then(() => {
      // Genera un PDF
      var doc = new jsPDF();
      doc.setFont("helvetica"); // Cambiar la fuente a Helvetica
      doc.setFontSize(12); // Cambiar el tamaño de fuente a 12
      doc.text(`Tipo de transacción: Retiro\n Monto: $${monto}\n Nota: ${nota}\n Fecha: ${fechaHoraActual}`, 20, 20)
      doc.save('reporte.pdf')
    });
  } else {
    swal("Saldo insuficiente", "", "error")
  }
}

// Maneja las transacciones
function transactControl() {
  let monto = parseInt(document.querySelector("#monto").value);
  let nota = document.querySelector("#nota").value;
  if (monto != '' && nota != '') {
    if (btnTransac.classList.contains("depositar")) {
      saldo += monto;
      historial.push({ tipo: "deposito", monto: monto, nota: nota });
      swal("Transacción realizada correctamente", "", "success").then(() => {
        // Guarda los datos en local storage
        localStorage.setItem("saldo", saldo.toString());
        localStorage.setItem("historial", JSON.stringify(historial));
        // Limpia los campos
        document.getElementById("monto").value = "";
        document.getElementById("nota").value = "";
        // Genera un PDF
        var doc = new jsPDF();
        doc.setFont("helvetica"); // Cambiar la fuente a Helvetica
        doc.setFontSize(12); // Cambiar el tamaño de fuente a 12
        doc.text(`Tipo de transacción: Depósito\n Monto: $${monto}\n Nota: ${nota}\n Fecha: ${fechaHoraActual}`, 20, 20)
        doc.save('reporte.pdf')
      });
    } else {
      if (monto <= saldo) {
        saldo -= monto;
        historial.push({ tipo: "retiro", monto: monto, nota: nota });
        // Guarda los datos en local storage
        swal("Transacción realizada correctamente", "", "success").then(() => {
          localStorage.setItem("saldo", saldo);
          localStorage.setItem("historial", JSON.stringify(historial));
          // Limpia los campos
          document.getElementById("monto").value = "";
          document.getElementById("nota").value = "";
          // Genera un PDF
          var doc = new jsPDF();
          doc.setFont("helvetica"); // Cambiar la fuente a Helvetica
          doc.setFontSize(12); // Cambiar el tamaño de fuente a 12
          doc.text(`Tipo de transacción: Retiro\n Monto: $${monto}\n Nota: ${nota}\n Fecha: ${fechaHoraActual}`, 20, 20)
          doc.save('reporte.pdf')
        });
      } else {
        swal("Saldo insuficiente", "", "error")
      }
    }
  } else {
    swal("No se permiten campos vacíos", "", "error")
  }
}

// Función que limpia los campos
function limpiarCampos() {
  document.getElementById("monto").value = "";
  document.getElementById("nota").value = "";
}

window.addEventListener("load", function() {
  if (window.location.href.includes("transacciones.html")) {
    actualizarHistorial();
    crearGrafica();
  }
});

// Actualiza el historial de transacciones dinámicamente
function actualizarHistorial() {
  if(transacList != null){
    transacList.innerHTML = "";
    historial.forEach(function(transaccion) {
      var li = document.createElement("li");
      li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
      if (transaccion.tipo == "deposito")
        li.innerHTML = `${transaccion.nota} <span class="badge bg-danger rounded-pill p-2">+$${transaccion.monto}</span>`;
      else
        li.innerHTML = `${transaccion.nota} <span class="badge bg-primary rounded-pill p-2">-$${transaccion.monto}</span>`;
      transacList.appendChild(li);
    });
  }
}

// Función para obtener la cantidad de depósitos en el historial
function obtenerCantidadDepositos() {
  const historialLocalStorage = JSON.parse(localStorage.getItem('historial')) || [];
  return historialLocalStorage.reduce(function (contador, transaccion) {
    if (transaccion.tipo === 'deposito') {
      return contador + 1;
    } else {
      return contador;
    }
  }, 0);
}

// Función para obtener la cantidad de retiros en el historial
function obtenerCantidadRetiros() {
  const historialLocalStorage = JSON.parse(localStorage.getItem('historial')) || [];
  return historialLocalStorage.reduce(function (contador, transaccion) {
    if (transaccion.tipo === 'retiro') {
      return contador + 1;
    } else {
      return contador;
    }
  }, 0);
}

// Crea la gráfica
function crearGrafica(){
  // Configuración para gráfica de pastel
  var datos = {
    labels: ["Retiros", "Depósitos"],
    datasets: [
      {
        data: [obtenerCantidadRetiros(), obtenerCantidadDepositos()],
        backgroundColor: ["#0D6EFD", "#DC3545"],
        hoverBackgroundColor: ["#0D47A1", "#C62828"]
      }
    ]
  };

  var opciones = {
    responsive: true,
    maintainAspectRatio: false
  };

  var grafica = new Chart(document.getElementById("acquisitions"), {
    type: 'pie',
    data: datos,
    options: opciones
  });
}
