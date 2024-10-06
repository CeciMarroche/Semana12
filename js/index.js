let peliculas = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())   
    .then(data => {
      peliculas = data;
      localStorage.setItem('peliculas', JSON.stringify(data)); 
      console.log('Películas cargadas:', peliculas); 
    })
    .catch(error => console.error('Error:', error)); 
});

document.getElementById('btnBuscar').addEventListener('click', function () {
  const query = document.getElementById('inputBuscar').value.trim().toLowerCase();
  console.log('Búsqueda realizada:', query); // Verifica si el input está recibiendo la búsqueda
  const listaPeliculas = document.getElementById('lista');
  listaPeliculas.innerHTML = ''; 

  if (query) {
    const peliculasFiltradas = peliculas.filter(pelicula => {
      return pelicula.title.toLowerCase().includes(query) ||
             (pelicula.tagline && pelicula.tagline.toLowerCase().includes(query));
    });

    console.log('Películas filtradas:', peliculasFiltradas); // Verifica si el filtrado está funcionando

    if (peliculasFiltradas.length === 0) {
      listaPeliculas.innerHTML = '<p class="text-center">No se encontraron películas.</p>'; 
    } else {
      peliculasFiltradas.forEach(pelicula => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'bg-dark' ,'text-white', 'mb-2');
        li.innerHTML = `
          <h5>${pelicula.title}</h5>
          <p>${pelicula.tagline || 'No description'}</p>
          <p>${estrellas(pelicula.vote_average)}</p>
        `;
        li.addEventListener('click', () => infoPeliculas(pelicula));
        listaPeliculas.appendChild(li);
      });
    }
  }
});

function infoPeliculas(pelicula) {
    document.getElementById('tituloPelicula').textContent = pelicula.title;
    document.getElementById('overviewPelicula').textContent = pelicula.overview || 'No description available';
  
    // Limpiar géneros anteriores
    const listaGeneros = document.getElementById('genresPelicula');
    listaGeneros.innerHTML = ''; 
  
    // Acceder correctamente a los nombres de los géneros
    pelicula.genres.forEach(genre => {
      const divGenero = document.createElement('div');
      divGenero.classList.add('mb-2'); 
      divGenero.textContent = genre.name; 
      listaGeneros.appendChild(divGenero); 
    });
  
    // Mostrar más detalles
    document.getElementById('releaseDate').textContent = pelicula.release_date ? `Año: ${pelicula.release_date.split('-')[0]}` : 'Año no disponible';
    document.getElementById('runtime').textContent = pelicula.runtime ? `Duración: ${pelicula.runtime} min` : 'Duración no disponible';
    document.getElementById('budget').textContent = pelicula.budget ? `Presupuesto: $${pelicula.budget.toLocaleString()}` : 'Presupuesto no disponible';
    document.getElementById('revenue').textContent = pelicula.revenue ? `Ganancias: $${pelicula.revenue.toLocaleString()}` : 'Ganancias no disponibles';
  
    // Mostrar el offcanvas
    const offcanvasElement = document.getElementById('detallePelicula');
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
  }
  
  
// Funcion para mostrar las estrellas
function estrellas(vote_average) {
  const estrellitas = 5;
  const rating = Math.round(vote_average / 2);
  let estrellotasHTML = '';

  for (let i = 1; i <= rating; i++) {
    estrellotasHTML += '<span class="fa fa-star checked"></span>';
  }

  for (let i = 0; i < (estrellitas - rating); i++) {
    estrellotasHTML += '<span class="fa fa-star"></span>';
  }

  return estrellotasHTML;
}