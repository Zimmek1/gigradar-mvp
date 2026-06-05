const samplePosts = [
  {
    source: "Facebook",
    text: "Friday night at The Evening Muse: Riverbend Saints with opener Clara June. Alt-country, dusty folk, $12 doors at 8.",
    band: "Riverbend Saints",
    venue: "The Evening Muse",
    city: "Charlotte, NC",
    date: "Friday",
    distance: 8,
    genres: ["alt-country", "indie folk", "americana"],
    similarTo: ["Zach Bryan", "Tyler Childers", "Jason Isbell"]
  },
  {
    source: "X",
    text: "Tonight at Snug Harbor: Neon Creek + DJ Luma. Synth pop, dream pop, dancey indie. 9pm.",
    band: "Neon Creek",
    venue: "Snug Harbor",
    city: "Charlotte, NC",
    date: "Tonight",
    distance: 11,
    genres: ["synth pop", "dream pop", "indie pop"],
    similarTo: ["The 1975", "M83", "Tame Impala"]
  },
  {
    source: "Threads",
    text: "Saturday at Petra's: The Mill House Boys. Bluegrass, folk, country rock. Tickets $10.",
    band: "The Mill House Boys",
    venue: "Petra's",
    city: "Charlotte, NC",
    date: "Saturday",
    distance: 13,
    genres: ["bluegrass", "folk", "country rock"],
    similarTo: ["Billy Strings", "Tyler Childers", "Turnpike Troubadours"]
  },
  {
    source: "Facebook",
    text: "Amos' Southend presents Static Bloom. Loud shoegaze and indie rock for fans of walls of guitar.",
    band: "Static Bloom",
    venue: "Amos' Southend",
    city: "Charlotte, NC",
    date: "Saturday",
    distance: 16,
    genres: ["shoegaze", "indie rock", "noise pop"],
    similarTo: ["Slowdive", "DIIV", "My Bloody Valentine"]
  },
  {
    source: "X",
    text: "Local hip-hop showcase at Neighborhood Theatre: Kay Rowe, Niko North, and guests. Friday 10pm.",
    band: "Kay Rowe",
    venue: "Neighborhood Theatre",
    city: "Charlotte, NC",
    date: "Friday",
    distance: 9,
    genres: ["hip-hop", "rap", "r&b"],
    similarTo: ["J. Cole", "Saba", "Kendrick Lamar"]
  },
  {
    source: "Threads",
    text: "Mooresville Brewing has Honeyrail playing Sunday. Easygoing southern rock and classic covers.",
    band: "Honeyrail",
    venue: "Mooresville Brewing",
    city: "Mooresville, NC",
    date: "Sunday",
    distance: 27,
    genres: ["southern rock", "country rock", "classic rock"],
    similarTo: ["Lynyrd Skynyrd", "Zach Bryan", "Chris Stapleton"]
  }
];

const favoritesInput = document.getElementById("favoritesInput");
const radiusInput = document.getElementById("radiusInput");
const radiusLabel = document.getElementById("radiusLabel");
const findBtn = document.getElementById("findBtn");
const results = document.getElementById("results");
const resultCount = document.getElementById("resultCount");

radiusInput.addEventListener("input", () => {
  radiusLabel.textContent = radiusInput.value;
});

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

function scoreShow(show, favorites) {
  const favoriteTerms = favorites.split(",").map(normalize).filter(Boolean);
  const showTerms = [...show.genres, ...show.similarTo].map(normalize);

  let score = 20;
  for (const fav of favoriteTerms) {
    for (const term of showTerms) {
      if (term.includes(fav) || fav.includes(term)) score += 24;
      else if (term.split(" ").some(word => fav.includes(word) && word.length > 3)) score += 8;
    }
  }

  score += Math.max(0, 18 - show.distance * 0.35);
  return Math.min(99, Math.round(score));
}

function renderShows() {
  const favorites = favoritesInput.value;
  const radius = Number(radiusInput.value);

  const matches = samplePosts
    .filter(show => show.distance <= radius)
    .map(show => ({ ...show, score: scoreShow(show, favorites) }))
    .sort((a, b) => a.distance - b.distance || b.score - a.score);

  resultCount.textContent = `${matches.length} matches`;
  results.innerHTML = "";

  if (!matches.length) {
    results.innerHTML = '<p class="empty">No shows found inside that radius. Try increasing the radius.</p>';
    return;
  }

  matches.forEach(show => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div>
        <h3>${show.band}</h3>
        <p class="meta"><strong>${show.date}</strong> · ${show.venue} · ${show.distance} miles away</p>
        <p class="meta">Found from ${show.source}: “${show.text}”</p>
        <p class="meta">Similar to: ${show.similarTo.join(", ")}</p>
        <div class="badges">${show.genres.map(g => `<span class="badge">${g}</span>`).join("")}</div>
      </div>
      <div class="score">${show.score}%<br><span class="badge">match</span></div>
    `;
    results.appendChild(card);
  });
}

findBtn.addEventListener("click", renderShows);
renderShows();
