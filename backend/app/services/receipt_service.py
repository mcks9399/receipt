import uuid
from datetime import date
from pathlib import Path

from fastapi import HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.receipt import Receipt
from app.ocr.factory import get_ocr_provider
from app.schemas.receipt import ReceiptCreate, ReceiptUpdate

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


def list_receipts(
    db: Session,
    *,
    year: int | None = None,
    month: int | None = None,
    category_id: int | None = None,
) -> list[Receipt]:
    stmt = select(Receipt).order_by(Receipt.paid_at.desc(), Receipt.id.desc())
    if year is not None:
        start = date(year, 1, 1)
        end = date(year + 1, 1, 1)
        stmt = stmt.where(Receipt.paid_at >= start, Receipt.paid_at < end)
    if month is not None and year is not None:
        start = date(year, month, 1)
        end_year, end_month = (year + 1, 1) if month == 12 else (year, month + 1)
        end = date(end_year, end_month, 1)
        stmt = stmt.where(Receipt.paid_at >= start, Receipt.paid_at < end)
    if category_id is not None:
        stmt = stmt.where(Receipt.category_id == category_id)
    return list(db.scalars(stmt).all())


def create_receipt(db: Session, payload: ReceiptCreate) -> Receipt:
    receipt = Receipt(**payload.model_dump())
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    return receipt


async def create_receipt_with_image(
    db: Session, payload: ReceiptCreate, image: UploadFile
) -> Receipt:
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported image type: {image.content_type}")

    settings.upload_path.mkdir(parents=True, exist_ok=True)
    suffix = Path(image.filename or "").suffix or ".bin"
    stored_name = f"{uuid.uuid4().hex}{suffix}"
    stored_path = settings.upload_path / stored_name

    contents = await image.read()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(status_code=413, detail="File too large")
    stored_path.write_bytes(contents)

    get_ocr_provider().extract(stored_path)

    receipt = Receipt(**payload.model_dump(), image_path=str(stored_path))
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    return receipt


def update_receipt(db: Session, receipt: Receipt, payload: ReceiptUpdate) -> Receipt:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(receipt, field, value)
    db.commit()
    db.refresh(receipt)
    return receipt
