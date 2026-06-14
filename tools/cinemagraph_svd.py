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
Generate a subtle "living still" (cinemagraph base clip) from one photo using
Stable Video Diffusion, then push the .mp4 to a HF dataset repo.

Runs on Hugging Face Jobs:

  hf jobs uv run --flavor a10g-large --timeout 30m \
     --secrets HF_TOKEN=$HF_TOKEN \
     --env IMG_URL=https://galigeulacohen.com/photos/meditation.jpg \
     --env NAME=meditation --env OUT_REPO=tangent/gali-cinemagraphs \
     --env MOTION_BUCKET=50 --env SEED=7 \
     tools/cinemagraph_svd.py

SVD is image-only (no prompt) and designed for natural, subtle motion. The
amount of motion is governed by MOTION_BUCKET (lower = calmer); noise_aug
keeps the output faithful to the source frame. We render 25 frames; the web
encode step later turns that into a seamless ping-pong loop.
"""
import io
import os

import requests
import torch
from PIL import Image
from diffusers import StableVideoDiffusionPipeline
from diffusers.utils import export_to_video
from huggingface_hub import create_repo, upload_file

IMG_URL = os.environ["IMG_URL"]
NAME = os.environ.get("NAME", "clip")
OUT_REPO = os.environ["OUT_REPO"]
MOTION_BUCKET = int(os.environ.get("MOTION_BUCKET", "50"))
NOISE_AUG = float(os.environ.get("NOISE_AUG", "0.02"))
SEED = int(os.environ.get("SEED", "0"))
NUM_FRAMES = int(os.environ.get("NUM_FRAMES", "25"))
FPS = int(os.environ.get("FPS", "10"))

# SVD-XT is trained at 1024x576 (16:9). Center-crop the source to 16:9, resize.
TW, TH = 1024, 576
print(f"[1/4] fetching {IMG_URL}", flush=True)
resp = requests.get(IMG_URL, timeout=120)
resp.raise_for_status()
img = Image.open(io.BytesIO(resp.content)).convert("RGB")
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
img = img.resize((TW, TH), Image.LANCZOS)

print("[2/4] loading Stable Video Diffusion (xt)", flush=True)
pipe = StableVideoDiffusionPipeline.from_pretrained(
    "stabilityai/stable-video-diffusion-img2vid-xt",
    torch_dtype=torch.float16,
    variant="fp16",
)
pipe.to("cuda")

print(f"[3/4] generating {NUM_FRAMES} frames (motion_bucket={MOTION_BUCKET}, "
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

out_path = f"/tmp/{NAME}.mp4"
export_to_video(frames, out_path, fps=FPS)
print(f"[4/4] uploading {out_path} -> {OUT_REPO}", flush=True)
create_repo(OUT_REPO, repo_type="dataset", exist_ok=True)
upload_file(
    path_or_fileobj=out_path,
    path_in_repo=f"{NAME}.mp4",
    repo_id=OUT_REPO,
    repo_type="dataset",
)
print(f"DONE: {OUT_REPO}/{NAME}.mp4", flush=True)
