# GitHub Profile Stats

A tiny static website: enter any GitHub username and see

- number of public repos
- followers and following
- their 3 most used languages (by number of their own, non-fork repos)
- the top repo (most stars) for each of those languages

No build step, no dependencies, no backend. It calls the public GitHub REST API from the browser.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Deploy on GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Notes

- Unauthenticated GitHub API requests are limited to 60 per hour per IP. Each search uses 2+ requests (1 for the user, 1 per 100 repos).
- Only public repos are counted.
