#!/usr/bin/env bash
# Build HTML (and optional PDF) from Markdown CV with Harvard-style CSS.
#
# Usage:
#   ./scripts/build-cv.sh EN KeywordsSlug [HHMM]
#   ./scripts/build-cv.sh ES PythonBackend
#
# Output naming (ddmmyy = day/month/year, 2-digit year):
#   {LANG}_CV_Cesar_Patino_{Keywords}_{ddmmyy}.html
#   If you export more than one PDF the same day for the same keyword slug,
#   pass HHMM (24h, no colon) so the name becomes:
#   {LANG}_CV_Cesar_Patino_{Keywords}_{HHMM}_{ddmmyy}.html
#
# Examples:
#   ./scripts/build-cv.sh EN FullstackPythonNextReactTS
#   → EN_CV_Cesar_Patino_FullstackPythonNextReactTS_100526.html
#   ./scripts/build-cv.sh EN FullstackPythonNextReactTS 1430
#   → EN_CV_Cesar_Patino_FullstackPythonNextReactTS_1430_100526.html

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/source"
STYLE="$ROOT/styles/harvard-print.css"
OUT="$ROOT/out"
mkdir -p "$OUT"

LANG="${1:?Usage: $0 EN|ES KeywordsSlug [HHMM]}"
KEYWORDS="${2:?Usage: $0 EN|ES KeywordsSlug [HHMM]}"
HHMM="${3:-}"

LANG_U=$(echo "$LANG" | tr '[:lower:]' '[:upper:]')
case "$LANG_U" in EN|ES) ;; *) echo "LANG must be EN or ES"; exit 1 ;; esac

MD="$SRC/CV_EN.md"
[[ "$LANG_U" == "ES" ]] && MD="$SRC/CV_ES.md"

if [[ ! -f "$MD" ]]; then
  echo "Missing $MD"
  exit 1
fi

DDMMYY=$(date +%d%m%y)
# Slug: letters, digits, hyphen, underscore only (no spaces)
SAFE=$(echo "$KEYWORDS" | LC_ALL=C sed 's/[^A-Za-z0-9_-]//g')
[[ -z "$SAFE" ]] && SAFE="CV"

if [[ -n "$HHMM" ]]; then
  BASENAME="${LANG_U}_CV_Cesar_Patino_${SAFE}_${HHMM}_${DDMMYY}"
else
  BASENAME="${LANG_U}_CV_Cesar_Patino_${SAFE}_${DDMMYY}"
fi

HTML_OUT="$OUT/${BASENAME}.html"

if ! command -v pandoc &>/dev/null; then
  echo "pandoc is required. Install: brew install pandoc"
  exit 1
fi

pandoc "$MD" -o "$HTML_OUT" --standalone --embed-resources --css="$STYLE" \
  --metadata title="César Patiño — CV (${LANG_U})"

echo "Wrote: $HTML_OUT"
echo "PDF: open the HTML in Chrome or Edge → Print → Destination: Save as PDF → use filename ${BASENAME}.pdf"

if command -v weasyprint &>/dev/null; then
  PDF_OUT="$OUT/${BASENAME}.pdf"
  weasyprint "$HTML_OUT" "$PDF_OUT"
  echo "Wrote: $PDF_OUT (weasyprint)"
fi
