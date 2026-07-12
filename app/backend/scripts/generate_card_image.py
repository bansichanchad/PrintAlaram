import asyncio
import base64
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

sys.path.insert(0, str(ROOT_DIR))
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration

PROMPT = (
    "A premium luxurious Indian wedding money envelope (shagun lifafa), flat lay front view, "
    "deep royal purple and antique gold color palette, ornate gold foil floral and paisley patterns, "
    "an arched palace-dome shaped top flap like a Rajasthani haveli silhouette, intricate golden "
    "mandala borders and filigree corner ornaments, small decorative diyas and marigold flower motifs, "
    "ample clean empty space in the center for printing a couple's names and wedding date, "
    "richly detailed traditional Indian royal wedding invitation envelope design, elegant, symmetrical, "
    "high resolution product photography, no text, no watermark"
)


async def main():
    api_key = os.environ['EMERGENT_LLM_KEY']
    image_gen = OpenAIImageGeneration(api_key=api_key)
    images = await image_gen.generate_images(prompt=PROMPT, model="gpt-image-1", number_of_images=1)
    if not images:
        print("NO_IMAGE_GENERATED")
        return
    out_path = Path("/app/frontend/public/cards/wedding-royal-1.jpg")
    out_path.write_bytes(images[0])
    print(f"SAVED:{out_path}")


if __name__ == "__main__":
    asyncio.run(main())
