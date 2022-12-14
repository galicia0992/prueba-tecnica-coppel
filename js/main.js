import {
  actualizarObjeto,
  altaArticulo,
  articulos,
  dcfLlamado,
  eliminarRegistro,
} from "./API.js";

//para esta prueba el id del objeto es tratado como sku

//selectores de barra flotante
const home = document.querySelector("#home");
const alta = document.querySelector("#alta");
const baja = document.querySelector("#baja");
const modificar = document.querySelector("#modificar");
const dcf = document.querySelector("#dcf");

//selectores tablas
const tablaDepartamentos = document.querySelector("#tablaDepartamentos");
const tablaArticulos = document.querySelector("#tablaArticulos");

//selectores de encabezados de tablas
const hdDepartamentos = document.querySelector("#hdDepartamentos");
const hdArticulos = document.querySelector("#hdArticulos");

//selectores de inputs de consulta
const buscarSku = document.querySelector("#buscarSku");
const inputSku = document.querySelector("#inputSku");
const mensaje = document.querySelector("#mensaje");
const formSku = document.querySelector("#formSku");

//selectores de inputs de alta
const skuId = document.querySelector("#sku");
const articuloId = document.querySelector("#articulo");
const marcaId = document.querySelector("#marca");
const modeloId = document.querySelector("#modelo");
const departamentoId = document.querySelector("#departamento");
const claseId = document.querySelector("#clase");
const familiaId = document.querySelector("#familia");
const stockId = document.querySelector("#stock");
const cantidadId = document.querySelector("#cantidad");
const guardar = document.querySelector("#guardar");

//selector de boton para validar sku para alta
const btnValidarSku = document.querySelector("#btnValidarSku");

//selector de boton para hacer el POST al json
const skuActualizar = document.querySelector("#skuActualizar");

//selectores de input para cambios de articulos
const articuloActualizar = document.querySelector("#articuloActualizar");
const marcaActualizar = document.querySelector("#marcaActualizar");
const modeloActualizar = document.querySelector("#modeloActualizar");
const departamentoActualizar = document.querySelector(
  "#departamentoActualizar"
);
const claseActualizar = document.querySelector("#claseActualizar");
const familiaActualizar = document.querySelector("#familiaActualizar");
const stockActualizar = document.querySelector("#stockActualizar");
const cantidadActualizar = document.querySelector("#cantidadActualizar");
const fechaAltaActualizar = document.querySelector("#fechaAltaActualizar");
const fechaBajaActualizar = document.querySelector("#fechaBajaActualizar");
const descontinuadoActualizar = document.querySelector(
  "#descontinuadoActualizar"
);

//selector para hacer PUT al json
const guardarActualizar = document.querySelector("#guardarActualizar");

//selector para validar el sku del articulo a modificar
const btnValidarSkuActualizar = document.querySelector(
  "#btnValidarSkuActualizar"
);
const formSkuEliminar = document.querySelector("#formSkuEliminar");
const inputSkuEliminar = document.querySelector("#inputSkuEliminar");
const eliminarArticulo = document.querySelector("#eliminarArticulo");
const confirmarEliminar = document.querySelector("#confirmarEliminar");
const statusObjeto = document.querySelector("#statusObjeto");

//date
const fecha = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

//event listeners de botones de barra flotante
home.addEventListener("click", inicio);
dcf.addEventListener("click", mostrarDcf);
alta.addEventListener("click", botonAlta);
baja.addEventListener("click", function () {
  formSku.classList.add("d-none"), formSkuEliminar.classList.remove("d-none");
  res();
});
modificar.addEventListener("click", botonModificar);

//boton de consultar por sku
buscarSku.addEventListener("click", mostrarArticulos);

//boton para guardar formulario de alta de articulo
guardar.addEventListener("click", guardarAlta);

//boton para validar el sku dentro del formulario de alta
btnValidarSku.addEventListener("click", validarSku);

//boton para eliminar articulo en la seccion de baja
eliminarArticulo.addEventListener("click", eliminar);

//boton de la seccion de baja donde muestra con un modal si el sku que se eliminara existe o no
confirmarEliminar.addEventListener("click", mostrarStatusObjeto);

//boton para validar el sku del articulo que se va a modificar
btnValidarSkuActualizar.addEventListener("click", validarSkuActualizar);

//boton para hacer PUT y actualizar un articulo
guardarActualizar.addEventListener("click", guardarAltaActualizar);

//libera los campos si el sku no existe, caso contrario los bloquea
async function validarSku() {
  skuId.classList.remove("shake-horizontal");
  const datos = await articulos();
  const arrComp = [];
  datos.forEach((item) => {
    const { id } = item;
    id == skuId.value ? arrComp.push(id) : "";
  });

  //verifica que lo que esta en el input es un texto, si no es texto, pasa a comprobar si el sku existe
  //se usa isNaN por que el input solo acepta texto, al parsearl el texto provoca como resultado un NaN, asi puedo provar
  //si lo que esta en el input es un texto(NaN) o un numero y hacer la validacion
  isNaN(parseInt(skuId.value)) == false
    ? arrComp[0] !== parseInt(skuId.value)
      ? (skuId.classList.remove("inputWarning"),
        (skuId.nextElementSibling.innerHTML = ""),
        (articuloId.disabled = false),
        (marcaId.disabled = false),
        (modeloId.disabled = false),
        (departamentoId.disabled = false),
        (claseId.disabled = false),
        (familiaId.disabled = false),
        (stockId.disabled = false),
        (cantidadId.disabled = false),
        (guardar.disabled = false))
      : (skuId.classList.add("inputWarning"),
        skuId.classList.add("shake-horizontal"),
        (skuId.nextElementSibling.innerHTML = "El Sku buscado ya existe"),
        (articuloId.disabled = true),
        (marcaId.disabled = true),
        (modeloId.disabled = true),
        (departamentoId.disabled = true),
        (claseId.disabled = true),
        (familiaId.disabled = true),
        (stockId.disabled = true),
        (cantidadId.disabled = true),
        (guardar.disabled = true))
    : (skuId.classList.add("inputWarning"),
      skuId.classList.add("shake-horizontal"),
      (skuId.nextElementSibling.innerHTML = "Introduce solo numeros"),
      (articuloId.disabled = true),
      (marcaId.disabled = true),
      (modeloId.disabled = true),
      (departamentoId.disabled = true),
      (claseId.disabled = true),
      (familiaId.disabled = true),
      (stockId.disabled = true),
      (cantidadId.disabled = true),
      (guardar.disabled = true));
}
//se muestra todos los departamentos con sus clases y sus familias
async function mostrarDcf() {
  formSku.classList.add("d-none");
  formSkuEliminar.classList.add("d-none");
  tablaArticulos.remove();
  const datos = await dcfLlamado();
  datos.map((infoDcf) => {
    const { departamentos } = infoDcf;
    departamentos.map((item) => {
      const { clases, noDepartamento, departamento } = item;
      clases.map((item) => {
        const { familias, noClase, clase } = item;
        familias.map((item) => {
          const { familia, noFamilia } = item;
          tablaDepartamentos.classList.remove("d-none");
          let html = `<TR class="articulos">
        <TD>${noDepartamento}</TD>
        <TD>${departamento}</TD>
        <TD>${noClase}</TD>
        <TD>${clase}</TD>
        <TD>${noFamilia}</TD>
        <TD>${familia}</TD>
        </TR>`;
          hdDepartamentos.insertAdjacentHTML("afterend", html);
        });
      });
    });
  });
}

//esta funcion se trae todos los articulos del db.json
async function mostrarArticulos(e) {
  e.preventDefault();
  res();
  const datos = await articulos();
  tablaArticulos.classList.remove("d-none");
  datos
    .filter((item) => item.id == parseInt(inputSku.value))
    .map((infoArticulos) => {
      const {
        id,
        departamento,
        modelo,
        marca,
        clase,
        familia,
        descontinuado,
        fechaAlta,
        stock,
        cantidad,
        fechaBaja,
      } = infoArticulos;
      let html = `<TR class="articulos">
        <TD>${marca}</TD>
        <TD>${modelo}</TD>
        <TD>${departamento}</TD>
        <TD>${clase}</TD>
        <TD>${familia}</TD>
        <TD>${fechaAlta}</TD>
        <TD>${stock}</TD>
        <TD>${cantidad}</TD>
        <TD>${descontinuado}</TD>
        <TD>${fechaBaja}</TD></TR>`;
      hdArticulos.insertAdjacentHTML("afterend", html);
    });
  errores();
}

//si no existe un resultado, resalta el input en rojo y muestra mensaje de error, caso contrario lo regresa a su estado original
function errores() {
  if (!document.querySelector(".articulos")) {
    inputSku.classList.add("shake-horizontal");
    inputSku.classList.add("inputWarning");
    mensaje.classList.remove("text-muted");
    mensaje.classList.add("mensajeWarning");
    mensaje.innerHTML = "El SKU no existe o es valido";
    tablaArticulos.classList.add("d-none");
  } else {
    inputSku.classList.remove("shake-horizontal");
    tablaArticulos.classList.remove("d-none");
    inputSku.classList.remove("inputWarning");
    mensaje.classList.add("text-muted");
    mensaje.innerHTML = "Verifica si el SKU existe";
    console.log("lol");
  }
}

//retorna la pagina a su estado de inicio
function res() {
  const arts = document.querySelectorAll(".articulos");
  tablaDepartamentos.classList.add("d-none");
  tablaArticulos.classList.add("d-none");
  arts.forEach((articulosTabla) => {
    articulosTabla.remove();
  });
}

//al presional el boton de alta primero limpia todos los inputs, posterior se ingresa la informacion
async function botonAlta() {
  skuId.value = "";
  articuloId.value = "";
  marcaId.value = "";
  modeloId.value = "";
  departamentoId.value = "";
  claseId.value = "";
  familiaId.value = "";
  stockId.value = "";
  cantidadId.value = "";
  skuId.classList.remove("inputWarning");
  skuId.classList.remove("shake-horizontal"),
    cantidadId.classList.remove("shake-horizontal"),
    cantidadId.classList.remove("inputWarning"),
    articuloId.classList.remove("inputWarning"),
    articuloId.classList.remove("shake-horizontal"),
    modeloId.classList.remove("shake-horizontal"),
    modeloId.classList.remove("inputWarning"),
    marcaId.classList.remove("shake-horizontal"),
    marcaId.classList.remove("inputWarning"),
    (cantidadId.nextElementSibling.innerHTML = ""),
    (skuId.nextElementSibling.innerHTML = "");
  articuloId.disabled = true;
  marcaId.disabled = true;
  modeloId.disabled = true;
  departamentoId.disabled = true;
  claseId.disabled = true;
  familiaId.disabled = true;
  stockId.disabled = true;
  cantidadId.disabled = true;

  //se llaman a las clases, departamentos y familias para mostrarlos en el formulario
  const datos = await dcfLlamado();
  datos.map((infoDcf) => {
    departamentoId.innerHTML = "";
    const { departamentos } = infoDcf;
    departamentos.map((item) => {
      const { departamento, clases } = item;
      departamentoId.innerHTML += `
          <option value="${departamento}">${departamento}</option>`;
      departamentoId.addEventListener("click", function () {
        if (departamentoId.value == departamento) {
          claseId.innerHTML = "";
          familiaId.innerHTML = "";
          clases.map((item) => {
            const { familias, clase } = item;
            claseId.innerHTML += `
                    <option value="${clase}">${clase}</option>`;
            claseId.addEventListener("click", function () {
              if (claseId.value == clase) {
                familiaId.innerHTML = "";
                familias.map((item) => {
                  const { familia } = item;

                  familiaId.innerHTML += `<option value="${familia}">${familia}</option>`;
                });
              }
            });
          });
        }
      });
    });
  });
}

//hace POST al db.json
function guardarAlta() {
  const altaObj = {
    id: parseInt(skuId.value),
    articulo: articuloId.value,
    marca: marcaId.value,
    modelo: modeloId.value,
    departamento: departamentoId.value,
    clase: claseId.value,
    familia: familiaId.value,
    stock: parseInt(stockId.value),
    cantidad: parseInt(cantidadId.value),
    fechaAlta: fecha,
    fechaBaja: "",
    descontinuado: "",
  };

  //se comprueba si el id es letra, en caso de no serlo, pasa a comprobar si  cantidad no es mayor a stock o si los campos articulo,
  //modelo y marca estan vacios
  isNaN(altaObj.id) == true
    ? (skuId.classList.add("inputWarning"),
      (skuId.nextElementSibling.innerHTML = "Introduce solo numeros"))
    : articuloId.value == ""
    ? (articuloId.classList.add("inputWarning"),
      articuloId.classList.add("shake-horizontal"))
    : marcaId.value == ""
    ? (marcaId.classList.add("inputWarning"),
      marcaId.classList.add("shake-horizontal"))
    : modeloId.value == ""
    ? (modeloId.classList.add("inputWarning"),
      modeloId.classList.add("shake-horizontal"))
    : (skuId.classList.remove("inputWarning"),
      (skuId.nextElementSibling.innerHTML = ""),
      parseInt(cantidadId.value) > parseInt(stockId.value) ||
      cantidadId.value == "" ||
      stockId.value == ""
        ? (cantidadId.classList.add("inputWarning"),
          cantidadId.classList.add("shake-horizontal"),
          (cantidadId.nextElementSibling.innerHTML =
            "la cantidad no debe ser mayor al stock"))
        : (altaArticulo(altaObj),
          cantidadId.classList.remove("shake-horizontal"),
          cantidadId.classList.remove("inputWarning"),
          articuloId.classList.remove("inputWarning"),
          articuloId.classList.remove("shake-horizontal"),
          modeloId.classList.remove("shake-horizontal"),
          modeloId.classList.remove("inputWarning"),
          marcaId.classList.remove("shake-horizontal"),
          marcaId.classList.remove("inputWarning"),
          (cantidadId.nextElementSibling.innerHTML = "")));
}

//muestra si el objeto a eliminar existe o no
async function mostrarStatusObjeto(e) {
  e.preventDefault();
  const datos = await articulos();
  const arrComp = [];
  datos
    .filter((item) => item.id == parseInt(inputSkuEliminar.value))
    .map((item2) => {
      const { id } = item2;
      id == parseInt(inputSkuEliminar.value) ? arrComp.push(id) : "";
    });
  arrComp[0] == parseInt(inputSkuEliminar.value)
    ? ((eliminarArticulo.disabled = false),
      (statusObjeto.innerHTML = `??Desea eliminar el articulo con sku ${arrComp[0]}?`))
    : (inputSkuEliminar.classList.add("inputWarning"),
      (eliminarArticulo.disabled = true),
      (statusObjeto.innerHTML = `el sku no existe o el campo esta vacio`));
}

//llama a la api para eliminar el articulo por su id el cual es tratado como su sku
async function eliminar(e) {
  e.preventDefault();
  const datos = await articulos();
  datos
    .filter((item) => item.id == parseInt(inputSkuEliminar.value))
    .map((item2) => {
      eliminarRegistro(item2.id);
    });
}

//valida que el id(sku) exista
async function validarSkuActualizar() {
  skuActualizar.classList.remove("shake-horizontal");
  const datos = await articulos();
  const arrComp = [];
  datos
    .filter((item) => item.id == parseInt(skuActualizar.value))
    .map((item2) => {
      console.log(item2);
      const {
        id,
        articulo,
        cantidad,
        clase,
        departamento,
        descontinuado,
        familia,
        fechaAlta,
        fechaBaja,
        marca,
        modelo,
        stock,
      } = item2;
      id == skuActualizar.value ? arrComp.push(id) : "";
      articuloActualizar.value = articulo;
      marcaActualizar.value = marca;
      modeloActualizar.value = modelo;
      cantidadActualizar.value = cantidad;
      claseActualizar.value = clase;
      departamentoActualizar.value = departamento;
      familiaActualizar.value = familia;
      fechaAltaActualizar.value = fechaAlta;
      stockActualizar.value = stock;
      descontinuadoActualizar.addEventListener("click", function () {
        fechaBajaActualizar.value = fecha;
        if (descontinuadoActualizar.checked == false) {
          fechaBajaActualizar.value = "";
        }
      });

      descontinuadoActualizar.checked = descontinuado;
      fechaBajaActualizar.value = fechaBaja;
      console.log(descontinuadoActualizar);
    });
  arrComp[0] !== parseInt(skuActualizar.value)
    ? ((articuloActualizar.disabled = true),
      (marcaActualizar.disabled = true),
      (modeloActualizar.disabled = true),
      (departamentoActualizar.disabled = true),
      (claseActualizar.disabled = true),
      (familiaActualizar.disabled = true),
      (stockActualizar.disabled = true),
      (cantidadActualizar.disabled = true),
      (guardarActualizar.disabled = true),
      (descontinuadoActualizar.disabled = true),
      skuActualizar.classList.add("inputWarning"),
      skuActualizar.classList.add("shake-horizontal"),
      (skuActualizar.nextElementSibling.innerHTML = "El Sku buscado no existe"))
    : (skuId.classList.remove("shake-horizontal"),
      skuActualizar.classList.remove("inputWarning"),
      (skuActualizar.nextElementSibling.innerHTML = ""),
      (skuActualizar.disabled = true),
      (articuloActualizar.disabled = false),
      (marcaActualizar.disabled = false),
      (modeloActualizar.disabled = false),
      (departamentoActualizar.disabled = false),
      (claseActualizar.disabled = false),
      (familiaActualizar.disabled = false),
      (stockActualizar.disabled = false),
      (cantidadActualizar.disabled = false),
      (guardarActualizar.disabled = false),
      (descontinuadoActualizar.disabled = false));
  console.log(articuloActualizar.value);
}

//limpia de inicio los inputs del modal de modificar y llama a las clases, departamentos y familias
async function botonModificar() {
  skuActualizar.classList.remove("inputWarning");
  skuActualizar.nextElementSibling.innerHTML = "";
  skuActualizar.classList.remove("shake-horizontal");
  cantidadActualizar.classList.remove("shake-horizontal"),
    cantidadActualizar.classList.remove("inputWarning"),
    articuloActualizar.classList.remove("inputWarning"),
    articuloActualizar.classList.remove("shake-horizontal"),
    modeloActualizar.classList.remove("shake-horizontal"),
    modeloActualizar.classList.remove("inputWarning"),
    marcaActualizar.classList.remove("shake-horizontal"),
    marcaActualizar.classList.remove("inputWarning"),
  skuActualizar.disabled = false;
  skuActualizar.value = "";
  articuloActualizar.value = "";
  marcaActualizar.value = "";
  modeloActualizar.value = "";
  stockActualizar.value = "";
  cantidadActualizar.value = "";
  fechaAltaActualizar.value = "";
  fechaBajaActualizar.value = "";
  descontinuadoActualizar.checked = false;
  const datos = await dcfLlamado();
  datos.map((infoDcf) => {
    departamentoActualizar.innerHTML = "";
    const { departamentos } = infoDcf;
    departamentos.map((item) => {
      const { departamento, clases } = item;
      departamentoActualizar.innerHTML += `
            <option value="${departamento}">${departamento}</option>`;
      departamentoActualizar.addEventListener("click", function () {
        if (departamentoActualizar.value == departamento) {
          claseActualizar.innerHTML = "";
          familiaActualizar.innerHTML = "";
          clases.map((item) => {
            const { familias, clase } = item;
            claseActualizar.innerHTML += `
                      <option value="${clase}">${clase}</option>`;
            claseActualizar.addEventListener("click", function () {
              if (claseActualizar.value == clase) {
                familiaActualizar.innerHTML = "";
                familias.map((item) => {
                  const { familia } = item;
                  familiaActualizar.innerHTML += `<option value="${familia}">${familia}</option>`;
                });
              }
            });
          });
        }
      });
    });
  });
}

//guarda la info del modal de actualizar
function guardarAltaActualizar() {
  const altaObjActualizado = {
    id: parseInt(skuActualizar.value),
    articulo: articuloActualizar.value,
    marca: marcaActualizar.value,
    modelo: modeloActualizar.value,
    departamento: departamentoActualizar.value,
    clase: claseActualizar.value,
    familia: familiaActualizar.value,
    stock: parseInt(stockActualizar.value),
    cantidad: parseInt(cantidadActualizar.value),
    fechaAlta: fechaAltaActualizar.value,
    fechaBaja: fechaBajaActualizar.value,
    descontinuado: descontinuadoActualizar.checked,
  };
  //verifica que cantidad no sea mayor a stock
  articuloActualizar.value == ""
  ? (articuloActualizar.classList.add("inputWarning"),
    articuloActualizar.classList.add("shake-horizontal"))
  : marcaActualizar.value == ""
  ? (marcaActualizar.classList.add("inputWarning"),
    marcaActualizar.classList.add("shake-horizontal"))
  : modeloActualizar.value == ""
  ? (modeloActualizar.classList.add("inputWarning"),
    modeloActualizar.classList.add("shake-horizontal"))
  : parseInt(cantidadActualizar.value) > parseInt(stockActualizar.value) ||
  parseInt(cantidadActualizar.value) <= 0 ||
  parseInt(stockActualizar.value) <= 0
    ? (cantidadActualizar.classList.add("inputWarning"),
      cantidadActualizar.classList.add("shake-horizontal"),
      (cantidadActualizar.nextElementSibling.innerHTML =
        "la cantidad no debe ser mayor al stock"))
    : (actualizarObjeto(altaObjActualizado),
      cantidadActualizar.classList.remove("inputWarning"),
      cantidadActualizar.classList.remove("shake-horizontal"),
      cantidadId.classList.remove("shake-horizontal"),
        cantidadActualizar.classList.remove("inputWarning"),
        articuloActualizar.classList.remove("inputWarning"),
        articuloActualizar.classList.remove("shake-horizontal"),
        modeloActualizar.classList.remove("shake-horizontal"),
        modeloActualizar.classList.remove("inputWarning"),
        marcaActualizar.classList.remove("shake-horizontal"),
        marcaActualizar.classList.remove("inputWarning"),
      (cantidadActualizar.nextElementSibling.innerHTML = ""));
  
  
  
}


//recarga la pagina para regresar a inicio
function inicio() {
  location.reload();
}
