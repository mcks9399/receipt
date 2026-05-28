from __future__ import annotations

import base64
import json
import logging
import mimetypes
from datetime import datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any

import httpx

from app.core.config import settings
from app.ocr.base import OCRProvider, OCRResult

logger = logging.getLogger(__name__)

_RECEIPT_SCHEMA = {
    "type": "object",
    "properties": {
        "merchant": {
            "type": "string",
            "description": "Store/merchant name printed on the receipt (가맹점명)",
        },
        "total": {
            "type": "string",
            "description": "Total amount paid as a plain number string, no currency symbol",
        },
        "paid_at": {
            "type": "string",
            "description": "Date of purchase in ISO format YYYY-MM-DD",
        },
    },
    "required": ["merchant", "total", "paid_at"],
}

_DATE_FORMATS = (
    "%Y-%m-%d",
    "%Y/%m/%d",
    "%Y.%m.%d",
    "%Y%m%d",
    "%Y-%m-%dT%H:%M:%S",
    "%Y-%m-%d %H:%M:%S",
    "%d/%m/%Y",
    "%m/%d/%Y",
)


class UpstageOCRProvider(OCRProvider):
    """Upstage Information Extraction API(chat-completions 스타일)를 호출하는 OCR provider.

    `/v1/information-extraction` 엔드포인트에 이미지와 JSON schema를 전달해
    영수증의 가맹점/총액/결제일을 구조화된 형태로 받는다.
    """

    def __init__(
        self,
        api_key: str | None = None,
        api_base: str | None = None,
        model: str | None = None,
        timeout: float | None = None,
    ) -> None:
        self.api_key = api_key or settings.upstage_api_key
        if not self.api_key:
            raise RuntimeError(
                "UPSTAGE_API_KEY is not set. Add it to .env to use the upstage OCR provider."
            )
        self.api_base = (api_base or settings.upstage_api_base).rstrip("/")
        self.model = model or settings.upstage_ocr_model
        self.timeout = timeout if timeout is not None else settings.upstage_timeout_seconds

    def extract(self, image_path: Path) -> OCRResult:
        url = f"{self.api_base}/information-extraction"
        mime_type, _ = mimetypes.guess_type(str(image_path)) or ("application/octet-stream", None)
        b64 = base64.b64encode(image_path.read_bytes()).decode("ascii")
        data_url = f"data:{mime_type or 'image/png'};base64,{b64}"

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": [{"type": "image_url", "image_url": {"url": data_url}}],
                }
            ],
            "response_format": {
                "type": "json_schema",
                "json_schema": {"name": "receipt", "schema": _RECEIPT_SCHEMA},
            },
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            response = httpx.post(url, headers=headers, json=payload, timeout=self.timeout)
        except httpx.HTTPError as exc:
            logger.exception("Upstage OCR request failed: %s", exc)
            raise

        if response.status_code >= 400:
            logger.error(
                "Upstage OCR returned %s: %s", response.status_code, response.text[:500]
            )
            response.raise_for_status()

        return _parse_response(response.json())


def _parse_response(payload: dict[str, Any]) -> OCRResult:
    try:
        content = payload["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        logger.warning("Unexpected Upstage response shape: %s", exc)
        return OCRResult()

    try:
        fields = json.loads(content) if isinstance(content, str) else (content or {})
    except json.JSONDecodeError:
        logger.warning("Upstage returned non-JSON content: %r", content[:200])
        return OCRResult(raw_text=str(content))

    merchant = _clean_str(fields.get("merchant"))
    total = _to_decimal(fields.get("total"))
    paid_at = _to_datetime(fields.get("paid_at"))

    return OCRResult(
        merchant=merchant,
        total=total,
        paid_at=paid_at,
        raw_text=json.dumps(fields, ensure_ascii=False),
        confidence=None,
    )


def _clean_str(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _to_decimal(value: Any) -> Decimal | None:
    if value is None:
        return None
    cleaned = "".join(ch for ch in str(value) if ch.isdigit() or ch in ".,-")
    cleaned = cleaned.replace(",", "")
    if not cleaned or cleaned in {"-", ".", "-."}:
        return None
    try:
        return Decimal(cleaned)
    except InvalidOperation:
        return None


def _to_datetime(value: Any) -> datetime | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    for fmt in _DATE_FORMATS:
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None
