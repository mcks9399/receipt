from pathlib import Path

from app.ocr.base import OCRProvider, OCRResult


class NullOCRProvider(OCRProvider):
    def extract(self, image_path: Path) -> OCRResult:
        return OCRResult()
