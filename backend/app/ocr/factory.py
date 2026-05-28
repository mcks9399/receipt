from app.core.config import settings
from app.ocr.base import OCRProvider
from app.ocr.null_provider import NullOCRProvider
from app.ocr.upstage_provider import UpstageOCRProvider


def get_ocr_provider() -> OCRProvider:
    provider = settings.ocr_provider.lower()
    if provider == "null":
        return NullOCRProvider()
    if provider == "upstage":
        return UpstageOCRProvider()
    raise NotImplementedError(f"OCR provider '{provider}' is not implemented yet")
