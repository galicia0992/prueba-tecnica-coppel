const urlArticulos = "http://localhost:3000/articulos";
const urlDcf = "http://localhost:3000/departamentosClasesFamilias";

export const articulos = async () => {
  try {
    const response = await fetch(urlArticulos);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const dcfLlamado = async () => {
  try {
    const response = await fetch(urlDcf);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const altaArticulo = async (objArticulo) => {
  try {
    await fetch(urlArticulos, {
      method: "POST",
      body: JSON.stringify(objArticulo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("correcto");
  } catch (error) {
    console.log(error);
  }
};

export const eliminarRegistro = async (sku) => {
  try {
    await fetch(`${urlArticulos}/${sku}`, {
      method: "DELETE",
    });
    console.log("eliminado");
  } catch (error) {
    console.log(error);
  }
};
export const actualizarObjeto = async (obj) => {
  try {
    await fetch(`${urlArticulos}/${obj.id}`, {
      method: "PUT",
      body: JSON.stringify(obj),
      headers: {
        "Content-type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
