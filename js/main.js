import { altaArticulo, articulos, dcfLlamado, eliminarRegistro } from "./API.js";
const home = document.querySelector("#home");
const alta = document.querySelector("#alta");
const baja = document.querySelector("#baja");
const modificar = document.querySelector("#modificar");
const dcf = document.querySelector("#dcf");
const tablaDepartamentos = document.querySelector("#tablaDepartamentos");
const tablaArticulos = document.querySelector("#tablaArticulos");
const hdDepartamentos = document.querySelector("#hdDepartamentos");
const hdArticulos = document.querySelector("#hdArticulos");
const buscarSku = document.querySelector("#buscarSku");
const inputSku = document.querySelector("#inputSku");
const mensaje = document.querySelector("#mensaje");
const formSku = document.querySelector("#formSku");
const skuId = document.querySelector("#sku");
const articuloId = document.querySelector("#articulo");
const marcaId = document.querySelector("#marca");
const modeloId = document.querySelector("#modelo");
const departamentoId = document.querySelector("#departamento");
const claseId = document.querySelector("#clase");
const familiaId = document.querySelector("#familia");
const stockId = document.querySelector("#stock");
const cantidadId = document.querySelector("#cantidad");
const fechaAltaId = document.querySelector("#fechaAlta");
const fechaBajaId = document.querySelector("#fechaBaja");
const descontinuadoId = document.querySelector("#descontinuado");
const guardar = document.querySelector("#guardar");
const btnValidarSku = document.querySelector("#btnValidarSku");
const formSkuEliminar = document.querySelector("#formSkuEliminar")
const inputSkuEliminar = document.querySelector("#inputSkuEliminar")
const mensajeEliminar = document.querySelector("#mensajeEliminar")
const eliminarArticulo = document.querySelector("#eliminarArticulo")

//event listeners
home.addEventListener("click", inicio);
dcf.addEventListener("click", mostrarDcf);
buscarSku.addEventListener("click", mostrarArticulos);
guardar.addEventListener("click", guardarAlta);
alta.addEventListener("click", botonAlta);
baja.addEventListener("click", function(){formSku.classList.add("d-none"), formSkuEliminar.classList.remove("d-none")})
btnValidarSku.addEventListener("click", validarSku);
eliminarArticulo.addEventListener("click", eliminar)

//libera los campos si el sku no existe, caso contrario los bloquea
async function validarSku() {
  const datos = await articulos();
  const arrComp = [];
  datos.forEach((item) => {
    const { sku } = item;
    sku == skuId.value ? arrComp.push(sku) : "";
  });
  arrComp[0] !== parseInt(skuId.value)
    ? ((articuloId.disabled = false),
      (marcaId.disabled = false),
      (modeloId.disabled = false),
      (departamentoId.disabled = false),
      (claseId.disabled = false),
      (familiaId.disabled = false),
      (stockId.disabled = false),
      (cantidadId.disabled = false),
      (fechaAltaId.disabled = false),
      (fechaBajaId.disabled = false),
      (descontinuadoId.disabled = false),
      (guardar.disabled = false))
    : ((articuloId.disabled = true),
      (marcaId.disabled = true),
      (modeloId.disabled = true),
      (departamentoId.disabled = true),
      (claseId.disabled = true),
      (familiaId.disabled = true),
      (stockId.disabled = true),
      (cantidadId.disabled = true),
      (fechaAltaId.disabled = true),
      (fechaBajaId.disabled = true),
      (descontinuadoId.disabled = true),
      (guardar.disabled = true));
}
//se muestra todos los departamentos con sus clases y sus familias
async function mostrarDcf() {
  formSku.classList.add("d-none");
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
    .filter((item) => item.sku == parseInt(inputSku.value))
    .map((infoArticulos) => {
      console.log(infoArticulos);
      console.log(inputSku.value);
      const {
        sku,
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
    inputSku.classList.add("inputWarning");
    mensaje.classList.remove("text-muted");
    mensaje.classList.add("mensajeWarning");
    mensaje.innerHTML = "El SKU no existe o es valido";
  } else {
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
async function botonAlta() {
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
    sku: parseInt(skuId.value),
    articulo: articuloId.value,
    marca: marcaId.value,
    modelo: modeloId.value,
    departamento: departamentoId.value,
    clase: claseId.value,
    familia: familiaId.value,
    stock: stockId.value,
    cantidad: cantidadId.value,
    fechaAlta: Date.now(),
    fechaBaja: null,
    descontinuado: descontinuadoId.value,
  };
  altaArticulo(altaObj);
}

async function eliminar(e){
    e.preventDefault()
    const datos = await articulos();
    datos.filter(item => item.sku == inputSkuEliminar.value).map(item2 =>{
        console.log(item2.sku)
        eliminarRegistro(item2.sku)
    })
    
}

function inicio() {
  location.reload();
}
