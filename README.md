# Romeer Pillay

Personal website: https://romeerp.github.io

## Editing

Articles live in content/posts.json. Layout and page generation live in scripts/build.mjs; styles and the CaseOps demo live in public/.

Run npm ci, npm run build, and npm run check. Commit the updated source and generated docs/ directory, then push to main. GitHub Pages automatically publishes docs/ from main. No domain registration, DNS setup, or paid services are required.

Preview locally with python3 -m http.server 4173 --directory docs.

KaTeX renders equations at build time and serves its fonts locally. Its license is included at docs/assets/KATEX-LICENSE.txt. There are no analytics or third-party browser scripts.

The DiMuon article was imported from the original write-up. Parameter Golf sources are linked within the article.
