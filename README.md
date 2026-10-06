# gitpeek

Type in a GitHub username and get a quick look at their profile.

**Live site:** https://cosminadotexe.github.io/gitpeek/

## What it shows

- how many public repos they have
- followers and following
- their top 3 languages
- their best repo (most stars) in each of those languages

## How it works

It's just HTML, CSS and JavaScript. The page asks GitHub's public API for the user's info and repos, counts which languages show up most, and picks the most-starred repo for each one. Forks don't count, only repos they made themselves.

## Running it

Open `index.html` in your browser. That's it.

## Heads up

GitHub only lets you make 60 requests an hour without logging in, so if you search a lot you'll get a rate limit message. Wait a bit and try again.
