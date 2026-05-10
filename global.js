console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 3.1 — Define your pages
let pages = [
  { url: 'index.html', title: 'Home' },
  { url: "projects/index.html", title: 'Projects' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'https://github.com/nkanthed06', title: 'GitHub' },
  { url: 'CV/index.html', title: 'Resume' },
  { url: 'meta/index.html', title: 'Meta' },
];

// Detect if local or on GitHub Pages
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"
  : "/Lab-Portfolio/"; 
  
// Create and prepend the nav
let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // Prefix relative URLs with BASE_PATH
  url = !url.startsWith('http') ? BASE_PATH + url : url;

  // Step 3.2 — Create link element
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  // Highlight current page
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  // Open external links in new tab
  if (a.host !== location.host) {
    a.target = '_blank';
  }

  nav.append(a);
}

// Step 4.2 - Inject the theme switcher
document.body.insertAdjacentHTML(
    'afterbegin',
    `<label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>`
  );
  
  // Step 4.4 - Make it actually work
  const select = document.querySelector('.color-scheme select');
  
  // Step 4.5 - Load saved preference
  if ("colorScheme" in localStorage) {
    const saved = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', saved);
    select.value = saved;
  }
  
  select.addEventListener('input', function (event) {
    const value = event.target.value;
    document.documentElement.style.setProperty('color-scheme', value);
    localStorage.colorScheme = value; // save preference
  });

  // Step 5 - Better contact form
const form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
  event.preventDefault(); // stop default submission

  const data = new FormData(form);
  let url = form.action + '?';

  for (let [name, value] of data) {
    url += `${name}=${encodeURIComponent(value)}&`;
  }

  // Remove trailing &
  url = url.slice(0, -1);

  window.open(url);

});

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}


export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';

  for (let project of projects) {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <div>
        <p>${project.description}</p>
        <p class="project-year">c. ${project.year}</p>
      </div>
    `;
    containerElement.appendChild(article);
  }
}

export async function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}