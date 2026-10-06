const API = "https://api.github.com";

const form = document.getElementById("form");
const input = document.getElementById("username");
const statusEl = document.getElementById("status");
const result = document.getElementById("result");
const button = form.querySelector("button");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = input.value.trim();
  if (!username) return;

  setStatus("Loading...");
  result.hidden = true;
  button.disabled = true;

  try {
    const user = await getJSON(`${API}/users/${encodeURIComponent(username)}`);
    const repos = await getAllRepos(user.login);
    render(user, repos);
    setStatus("");
  } catch (err) {
    setStatus(err.message, true);
  } finally {
    button.disabled = false;
  }
});

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.className = isError ? "error" : "";
}

async function getJSON(url) {
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (res.status === 404) throw new Error("User not found.");
  if (res.status === 403 || res.status === 429) {
    throw new Error("GitHub only allows 60 requests an hour without logging in. Wait a bit and try again.");
  }
  if (!res.ok) throw new Error(`GitHub API error (${res.status}).`);
  return res.json();
}

// Fetch all public repos (100 per page, up to 10 pages = 1000 repos).
async function getAllRepos(login) {
  let all = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await getJSON(
      `${API}/users/${encodeURIComponent(login)}/repos?per_page=100&page=${page}&type=owner`
    );
    all = all.concat(batch);
    if (batch.length < 100) break;
  }
  return all;
}

// "Most used" = languages that appear in the most of the user's own (non-fork) repos.
// Each language's top repo = the one with the most stars.
function topLanguages(repos, n = 3) {
  const byLang = new Map();
  for (const repo of repos) {
    if (repo.fork || !repo.language) continue;
    if (!byLang.has(repo.language)) byLang.set(repo.language, []);
    byLang.get(repo.language).push(repo);
  }
  return [...byLang.entries()]
    .map(([language, list]) => ({
      language,
      count: list.length,
      top: list.reduce((a, b) => (b.stargazers_count > a.stargazers_count ? b : a)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

function render(user, repos) {
  document.getElementById("avatar").src = user.avatar_url;
  document.getElementById("name").textContent = user.name || user.login;
  const link = document.getElementById("link");
  link.href = user.html_url;
  link.textContent = `@${user.login}`;

  document.getElementById("repos").textContent = user.public_repos;
  document.getElementById("followers").textContent = user.followers;
  document.getElementById("following").textContent = user.following;

  const langs = document.getElementById("languages");
  langs.replaceChildren();

  const top = topLanguages(repos);
  if (!top.length) {
    const p = document.createElement("p");
    p.className = "sub";
    p.textContent = "No language data available.";
    langs.append(p);
  }

  for (const { language, count, top: repo } of top) {
    const el = document.createElement("div");
    el.className = "lang";

    const head = document.createElement("div");
    head.className = "head";
    const name = document.createElement("span");
    name.className = "lname";
    name.textContent = language;
    const cnt = document.createElement("span");
    cnt.className = "count";
    cnt.textContent = `${count} repo${count === 1 ? "" : "s"}`;
    head.append(name, cnt);

    const topLine = document.createElement("div");
    topLine.className = "top";
    topLine.append("Top repo: ");
    const a = document.createElement("a");
    a.href = repo.html_url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = repo.name;
    topLine.append(a, ` ★ ${repo.stargazers_count}`);

    el.append(head, topLine);
    if (repo.description) {
      const d = document.createElement("div");
      d.className = "desc";
      d.textContent = repo.description;
      el.append(d);
    }
    langs.append(el);
  }

  result.hidden = false;
}
