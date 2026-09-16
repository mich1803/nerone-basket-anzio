"""Ritaglia i loghi trasparenti al primo pixel visibile e li esporta quadrati in WebP."""

from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "loghi2526"
DESTINATION = ROOT / "site" / "public" / "assets" / "teams" / "2025-26"
MAPPING = {
    "boys90.png": "boys-90-fiumicino.webp",
    "delfino.png": "delfino-basket-anzio.webp",
    "elite.png": "elite-roma-all-saints.webp",
    "free mind.png": "free-mind-roma.webp",
    "marino.png": "club-marino-lions.webp",
    "palestrina.png": "basket-palestrina.webp",
    "sl.png": "atletico-san-lorenzo.webp",
    "squad.png": "evergreen-la-squad.webp",
    "tivoli.png": "tivoli-basket.webp",
    "uisp-logo.png": "uisp-logo.webp",
}


DESTINATION.mkdir(parents=True, exist_ok=True)
for source_name, destination_name in MAPPING.items():
    with Image.open(SOURCE / source_name) as source:
        image = source.convert("RGBA")
        alpha = image.getchannel("A")
        bounds = alpha.getbbox()
        if bounds is None:
            raise ValueError(f"{source_name}: nessun pixel visibile")

        cropped = image.crop(bounds)
        side = max(cropped.size)
        square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        square.alpha_composite(cropped, ((side - cropped.width) // 2, (side - cropped.height) // 2))
        if side > 512:
            square = square.resize((512, 512), Image.Resampling.LANCZOS)

        square.save(DESTINATION / destination_name, "WEBP", lossless=True, method=6)
        print(f"{source_name}: {image.size} -> crop {cropped.size} -> {square.size}")
