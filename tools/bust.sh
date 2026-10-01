#!/usr/bin/env bash
# Stamp styles.css / script.js references in index.html with a content hash so
# browsers and Cloudflare never pair a new page with an old stylesheet. Run before every push.
set -euo pipefail
cd "$(dirname "$0")/.."
for f in styles.css script.js; do
  h=$(sha1sum "$f" | cut -c1-8)
  sed -i -E "s#(href|src)=\"$f(\?v=[0-9a-f]+)?\"#\1=\"$f?v=$h\"#" index.html
done
grep -oE '(styles\.css|script\.js)\?v=[0-9a-f]+' index.html
