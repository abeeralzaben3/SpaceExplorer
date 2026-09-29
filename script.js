const NASA_KEY = "lGtuJDihZwspty5pfmGoRMOMyTNM3hIpQ0GPPp4c";
const apodContainer = document.getElementById("apodContainer");

async function loadAPOD() {
  apodContainer.innerHTML = "<p>Loading...</p>";           

  try {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`); 
    if (!res.ok) throw new Error(`HTTP ${res.status}`);    

    const data = await res.json();                          

    apodContainer.innerHTML = `
      <div class="apod-card">
        <div class="apod-media"><img src="${data.url}" alt="${data.title}"></div>
        <div class="apod-info">
          <div class="apod-date">${data.date}</div>
          <h3 class="apod-title">${data.title}</h3>
          <div class="apod-explanation">${data.explanation}</div>
        </div>
      </div>`;                                             
  } catch (err) {
    apodContainer.innerHTML = `<p>Something went wrong: ${err.message}</p>`;
  }
}

loadAPOD();