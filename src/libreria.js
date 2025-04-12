const readlineSync = require('readline-sync');
const fs = require('fs');

let catalogo = [];

function mostrarMenu() {
  console.log(`
1. Agregar libro
2. Mostrar catálogo
3. Buscar libro por título
4. Eliminar libro
5. Ver estadísticas
6. Ordenar libros
7. Editar libro
8. Salir
`);
}

function agregarLibro() {
  const titulo = readlineSync.question('Título: ');
  const autor = readlineSync.question('Autor: ');
  const precio = parseFloat(readlineSync.question('Precio: '));
  const anio = parseInt(readlineSync.question('Año de publicación: '));

  if (isNaN(precio) || precio <= 0 || isNaN(anio)) {
    console.log('Datos inválidos. Intenta de nuevo.');
    return;
  }

  catalogo.push({ titulo, autor, precio, anio });
  console.log('Libro agregado exitosamente.');
}

function mostrarCatalogo() {
  if (catalogo.length === 0) {
    console.log('El catálogo está vacío.');
    return;
  }

  console.log('\nCatálogo de Libros:');
  catalogo.forEach((libro, i) => {
    console.log(`${i + 1}. ${libro.titulo} - ${libro.autor} - $${libro.precio} - Año: ${libro.anio}`);
  });
}

function buscarLibro() {
  const titulo = readlineSync.question('Ingrese el título del libro: ');
  const libro = catalogo.find(l => l.titulo.toLowerCase() === titulo.toLowerCase());

  if (libro) {
    console.log(`\nTítulo: ${libro.titulo}
Autor: ${libro.autor}
Precio: $${libro.precio}
Año: ${libro.anio}`);
  } else {
    console.log('Libro no encontrado.');
  }
}

function eliminarLibro() {
  const titulo = readlineSync.question('Ingrese el título del libro a eliminar: ');
  const index = catalogo.findIndex(l => l.titulo.toLowerCase() === titulo.toLowerCase());

  if (index !== -1) {
    catalogo.splice(index, 1);
    console.log('Libro eliminado.');
  } else {
    console.log('Libro no encontrado.');
  }
}

function verEstadisticas() {
  if (catalogo.length === 0) {
    console.log('No hay libros para analizar.');
    return;
  }

  const total = catalogo.length;
  const promedio = catalogo.reduce((sum, l) => sum + l.precio, 0) / total;
  const masAntiguo = catalogo.reduce((a, b) => (a.anio < b.anio ? a : b));
  const masCaro = catalogo.reduce((a, b) => (a.precio > b.precio ? a : b));

  console.log(`
Estadísticas:
Total de libros: ${total}
Precio promedio: $${promedio.toFixed(2)}
Libro más antiguo: ${masAntiguo.titulo} (${masAntiguo.anio})
Libro más caro: ${masCaro.titulo} ($${masCaro.precio})
`);
}

function ordenarLibros() {
  console.log('Criterios de ordenamiento:');
  console.log('1. Precio Ascendente');
  console.log('2. Precio Descendente');
  console.log('3. Año de Publicación');

  const opcion = readlineSync.question('Seleccione una opción: ');
  switch (opcion) {
    case '1':
      catalogo.sort((a, b) => a.precio - b.precio);
      break;
    case '2':
      catalogo.sort((a, b) => b.precio - a.precio);
      break;
    case '3':
      catalogo.sort((a, b) => a.anio - b.anio);
      break;
    default:
      console.log('Opción inválida.');
      return;
  }

  console.log('Libros ordenados.');
  mostrarCatalogo();
}

function editarLibro() {
  const titulo = readlineSync.question('Ingrese el título del libro a editar: ');
  const libro = catalogo.find(l => l.titulo.toLowerCase() === titulo.toLowerCase());

  if (!libro) {
    console.log('Libro no encontrado.');
    return;
  }

  console.log('Deje vacío si no desea modificar el campo.');
  const nuevoTitulo = readlineSync.question(`Nuevo título (${libro.titulo}): `);
  const nuevoAutor = readlineSync.question(`Nuevo autor (${libro.autor}): `);
  const nuevoPrecio = readlineSync.question(`Nuevo precio (${libro.precio}): `);
  const nuevoAnio = readlineSync.question(`Nuevo año (${libro.anio}): `);

  if (nuevoTitulo) libro.titulo = nuevoTitulo;
  if (nuevoAutor) libro.autor = nuevoAutor;
  if (nuevoPrecio && !isNaN(parseFloat(nuevoPrecio))) libro.precio = parseFloat(nuevoPrecio);
  if (nuevoAnio && !isNaN(parseInt(nuevoAnio))) libro.anio = parseInt(nuevoAnio);

  console.log('Libro actualizado.');
}

function guardarCatalogoEnArchivo() {
  fs.writeFileSync('catalogo.json', JSON.stringify(catalogo, null, 2));
  console.log('Catálogo guardado en catalogo.json');
}

function main() {
  let salir = false;

  while (!salir) {
    mostrarMenu();
    const opcion = readlineSync.question('Elige una opción: ');

    switch (opcion) {
      case '1':
        agregarLibro();
        break;
      case '2':
        mostrarCatalogo();
        break;
      case '3':
        buscarLibro();
        break;
      case '4':
        eliminarLibro();
        break;
      case '5':
        verEstadisticas();
        break;
      case '6':
        ordenarLibros();
        break;
      case '7':
        editarLibro();
        break;
      case '8':
        guardarCatalogoEnArchivo();
        salir = true;
        console.log('Hasta luego.');
        break;
      default:
        console.log('Opción inválida. Intente de nuevo.');
    }

    if (!salir) readlineSync.question('\nPresiona Enter para continuar...');
    console.clear();
  }
}

main();