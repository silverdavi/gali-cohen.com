# /// script
# dependencies = [
#   "torch",
#   "diffusers>=0.31",
#   "transformers",
#   "accelerate",
#   "pillow",
#   "requests",
#   "imageio[ffmpeg]",
#   "opencv-python-headless",
#   "huggingface_hub",
# ]
# ///
"""
Generate subtle "living still" base clips from a batch of photos using Stable
Video Diffusion, then push each .mp4 to a HF dataset repo.

Batching matters: the SVD-XT checkpoint is ~10 GB. We load it ONCE and loop over
every photo, so a 7-photo run pays the model download/load cost a single time.

Runs on Hugging Face Jobs:

  hf jobs uv run --flavor a10g-large --timeout 45m \
     --secrets HF_TOKEN=$HF_TOKEN \
     --env BASE_URL=https://galigeulacohen.com/photos \
     --env NAMES=portrait,breath,feet,hands,meditation,bowl,dance-circle \
     --env OUT_REPO=tangent/gali-cinemagraphs \
     --env MOTION_BUCKET=40 --env SEED=7 \
     tools/cinemagraph_svd.py

SVD is image-only (no prompt) and designed for natural, subtle motion. We render
a generous-but-calm clip here (MOTION_BUCKET governs amount; lower = calmer).
The *real* subtlety is dialed in locally afterwards by blending this motion over
the frozen still at low opacity and ping-pong looping it — keeping GPU work and
taste-tuning decoupled.
"""
import io
import os

import requests
import torch
from PIL import Image
from diffusers import StableVideoDiffusionPipeline
from diffusers.utils import export_to_video
from huggingface_hub import create_repo, upload_file

BASE_URL = os.environ["BASE_URL"].rstrip("/")
NAMES = [n.strip() for n in os.environ["NAMES"].split(",") if n.strip()]
OUT_REPO = os.environ["OUT_REPO"]
MOTION_BUCKET = int(os.environ.get("MOTION_BUCKET", "40"))
NOISE_AUG = float(os.environ.get("NOISE_AUG", "0.02"))
SEED = int(os.environ.get("SEED", "7"))
NUM_FRAMES = int(os.environ.get("NUM_FRAMES", "25"))
FPS = int(os.environ.get("FPS", "8"))

# SVD-XT is trained at 1024x576 (16:9). Center-crop each source to 16:9, resize.
TW, TH = 1024, 576


def fit_16x9(img: Image.Image) -> Image.Image:
    w, h = img.size
    target = TW / TH
    if w / h > target:
        nw = int(round(h * target))
        left = (w - nw) // 2
        img = img.crop((left, 0, left + nw, h))
    else:
        nh = int(round(w / target))
        top = (h - nh) // 2
        img = img.crop((0, top, w, top + nh))
    return img.resize((TW, TH), Image.LANCZOS)


print("[load] Stable Video Diffusion (xt)", flush=True)
pipe = StableVideoDiffusionPipeline.from_pretrained(
    "stabilityai/stable-video-diffusion-img2vid-xt",
    torch_dtype=torch.float16,
    variant="fp16",
)
pipe.to("cuda")

print(f"[repo] ensuring dataset {OUT_REPO}", flush=True)
create_repo(OUT_REPO, repo_type="dataset", exist_ok=True)

for i, name in enumerate(NAMES, 1):
    url = f"{BASE_URL}/{name}.jpg"
    print(f"\n=== [{i}/{len(NAMES)}] {name}  <-  {url}", flush=True)
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    img = fit_16x9(Image.open(io.BytesIO(resp.content)).convert("RGB"))

    print(f"  generating {NUM_FRAMES} frames (motion_bucket={MOTION_BUCKET}, "
          f"noise_aug={NOISE_AUG}, seed={SEED})", flush=True)
    generator = torch.manual_seed(SEED)
    frames = pipe(
        img,
        decode_chunk_size=4,
        generator=generator,
        motion_bucket_id=MOTION_BUCKET,
        noise_aug_strength=NOISE_AUG,
        num_frames=NUM_FRAMES,
        fps=FPS,
    ).frames[0]

    out_path = f"/tmp/{name}.mp4"
    export_to_video(frames, out_path, fps=FPS)
    print(f"  uploading -> {OUT_REPO}/{name}.mp4", flush=True)
    upload_file(
        path_or_fileobj=out_path,
        path_in_repo=f"{name}.mp4",
        repo_id=OUT_REPO,
        repo_type="dataset",
    )
    print(f"  DONE {name}", flush=True)

print(f"\nALL DONE: {len(NAMES)} clips -> {OUT_REPO}", flush=True)
