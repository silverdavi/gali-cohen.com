#!/usr/bin/env bash
# Turn raw SVD clips into subtle, seamless, web-ready cinemagraphs.
#
# The SVD output has more motion than we want. The subtlety knob is a low-opacity
# BLEND of that motion over the *frozen* original photo:
#     out = still*(1-α) + svd*α        (α small  →  barely-there life)
# then a ping-pong (forward + reverse) makes it loop with no visible seam.
#
# Usage:  tools/cinemagraph_encode.sh [raw_dir]
#   raw_dir defaults to tools/raw  (drop the downloaded <name>.mp4 files there)
#
# Requires: ffmpeg (libvpx-vp9 + libx264), and originals in public/photos/<name>.jpg
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RAW="${1:-$ROOT/tools/raw}"
PHOTOS="$ROOT/public/photos"
OUT="$ROOT/public/clips"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

W=1024; H=576

# Per-photo opacity of the motion layer. Lower = subtler. Faces get the least.
default_alpha() {
  case "$1" in
    meditation|dance-circle) echo 0.22 ;;  # seated/standing people — keep tiny
    breath)                  echo 0.24 ;;  # a body breathing
    hands)                   echo 0.28 ;;
    portrait|feet)           echo 0.30 ;;  # backs / limbs, safe
    bowl)                    echo 0.38 ;;  # object, can breathe a touch more
    *)                       echo 0.28 ;;
  esac
}

for mp4 in "$RAW"/*.mp4; do
  [ -e "$mp4" ] || { echo "no raw clips in $RAW"; exit 1; }
  name="$(basename "${mp4%.mp4}")"
  src="$PHOTOS/$name.jpg"
  if [ ! -f "$src" ]; then echo "skip $name (no $src)"; continue; fi
  a="$(default_alpha "$name")"
  echo "=== $name  (alpha=$a)"

  # 1) frozen base = original photo, center-cropped to the SVD aspect
  ffmpeg -v error -y -i "$src" \
    -vf "scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}" \
    "$TMP/still.png"

  # 2) blend the motion over the still at low opacity → subdued motion
  ffmpeg -v error -y -loop 1 -i "$TMP/still.png" -i "$mp4" -filter_complex \
    "[0:v]scale=${W}:${H},setsar=1,format=yuv420p[s];\
     [1:v]scale=${W}:${H},setsar=1,format=yuv420p[v];\
     [s][v]blend=all_mode=normal:all_opacity=${a},format=yuv420p[o]" \
    -map "[o]" -frames:v 25 -r 12 "$TMP/sub.mp4"

  # 3) ping-pong loop (drop the duplicated seam frame on the reverse)
  ffmpeg -v error -y -i "$TMP/sub.mp4" -filter_complex \
    "[0:v]split[a][b];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];\
     [a][r]concat=n=2:v=1[v]" -map "[v]" -r 12 "$TMP/loop.mp4"

  # 4) web encodes — VP9 (small) + H.264 (universal), no audio
  ffmpeg -v error -y -i "$TMP/loop.mp4" -an \
    -c:v libvpx-vp9 -b:v 0 -crf 36 -pix_fmt yuv420p "$OUT/$name.webm"
  ffmpeg -v error -y -i "$TMP/loop.mp4" -an \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 24 -movflags +faststart \
    "$OUT/$name.mp4"

  printf '   -> %s.webm (%s)  %s.mp4 (%s)\n' \
    "$name" "$(du -h "$OUT/$name.webm" | cut -f1)" \
    "$name" "$(du -h "$OUT/$name.mp4" | cut -f1)"
done
echo "done -> $OUT"
