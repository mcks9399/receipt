from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from pathlib import Path


@dataclass
class OCRResult:
    merchant: str | None = None
    total: Decimal | None = None
    paid_at: datetime | None = None
    raw_text: str = ""
    confidence: float | None = None


class OCRProvider(ABC):
    @abstractmethod
    def extract(self, image_path: Path) -> OCRResult:
        ...
