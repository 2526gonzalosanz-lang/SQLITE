const form = document.getElementById("artist-form");
const loadButton = document.getElementById("load-btn");
const deleteButton = document.getElementById("delete");
const artistOutput = document.getElementById("artist-output");
const albumOutput = document.getElementById("album-output");
const loadalbumButton = document.getElementById("load-albums-btn");
const loadartistButton = document.getElementById("load-artists-btn");


const artistNameInput = document.getElementById("artist-name");

async function select(table, camp, dat1, valor) {
  const res = await fetch("/api/select", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ table, camp, dat1, valor })
  });
  const json = await res.json();
  return json;
}

async function loadArtists() {
  const res = await fetch("/api/artists");
  const json = await res.json();
  const select = document.getElementById('album-artist');
  select.innerHTML = '<option value="">Selecciona un artista</option>';
  json.result.forEach(a => {
    select.innerHTML += `<option value="${a.id}">${a.name}</option>`;
  });
}

//Guardar àlbum
document.getElementById('album-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    title: document.getElementById('album-title').value,
    year: document.getElementById('album-year').value || null,
    artist_id: document.getElementById('album-artist').value
  };
  
  const response = await fetch('/api/AddAlbum', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: formData })
  });
  
  const result = await response.text();
  alert(result);
  document.getElementById('album-form').reset();
});

//Formulari àlbum
document.getElementById("album-form").addEventListener("submit", async e => {
  e.preventDefault();
  const data = {
    title: document.getElementById('album-title').value,
    year: document.getElementById('album-year').value || null,
    artist_id: document.getElementById('album-artist').value
  };

  const res = await fetch("/api/afegirAlbum", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data })
  });
  alert(await res.text());
  document.getElementById("album-form").reset();
});

//Carregar àlbum
document.getElementById("load-albums-btn").addEventListener("click", async () => {
  const res = await fetch('/api/albums', {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json' },
    body: JSON.stringify({data: 'albums'})
  });

  const data = await res.json();
  document.getElementById('album-output').innerHTML =
    data.result.map(a => `<b>${a.title}</b> (${a.year}) - ${a.artist_name}`).join('<br>');
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();//per defecte recarregaria la pagina així que evitem això.

  const name = artistNameInput.value.trim();
  if (!name) return;

  const res = await fetch("/api/AddArtist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: name })
  });

  const message = await res.text();
  artistOutput.textContent = message;
  if (res.ok) form.reset();
});

loadButton.addEventListener("click", async () => {

  let  text = "text a enviar en aquest cas la taula";
  text = "artists";
  // Fem una petició HTTP al servidor (Express)
  // fetch() envia una request al backend
  const res = await fetch("/api/artists", {
    // Tipus de petició
    // POST = enviem dades al servidor
    method: "POST",
    // Capçaleres HTTP
    // Indiquem que estem enviant dades en format JSON
    headers: {
      "Content-Type": "application/json"
    },

    // Cos de la petició (les dades que enviem)
    // Convertim l’objecte JS a text JSON
    body: JSON.stringify({ data: text })
  });

  // El servidor respon amb JSON
  const json = await res.json();
  // Mostrem el resultat a la textarea de sortida
  artistOutput.textContent = JSON.stringify(json.result, null, 2);

});
deleteButton.addEventListener("click", async () => {

  let  text = "text a enviar en aquest cas la taula";
  text = "artists";
  // Fem una petició HTTP al servidor (Express)
  // fetch() envia una request al backend
  const res = await fetch("/api/DeleteArtist", {
    // Tipus de petició
    // POST = enviem dades al servidor
    method: "POST",
    // Capçaleres HTTP
    // Indiquem que estem enviant dades en format JSON
    headers: {
      "Content-Type": "application/json"
    },

    // Cos de la petició (les dades que enviem)
    // Convertim l’objecte JS a text JSON
    body: JSON.stringify({ data: text })
  });

  // El servidor respon amb JSON
  const json = await res.json();
  // Mostrem el resultat a la textarea de sortida
  artistOutput.textContent = JSON.stringify(json.result, null, 2);
});