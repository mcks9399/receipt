from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.receipt import Receipt
from app.schemas.receipt import ReceiptCreate, ReceiptOCRPreview, ReceiptRead, ReceiptUpdate
from app.services import receipt_service

router = APIRouter(prefix="/receipts", tags=["receipts"])


@router.get("", response_model=list[ReceiptRead])
def list_receipts(
    year: int | None = None,
    month: int | None = None,
    category_id: int | None = None,
    db: Session = Depends(get_db),
) -> list[Receipt]:
    return receipt_service.list_receipts(db, year=year, month=month, category_id=category_id)


@router.get("/{receipt_id}", response_model=ReceiptRead)
def get_receipt(receipt_id: int, db: Session = Depends(get_db)) -> Receipt:
    receipt = db.get(Receipt, receipt_id)
    if receipt is None:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return receipt


@router.post("", response_model=ReceiptRead, status_code=status.HTTP_201_CREATED)
def create_receipt(payload: ReceiptCreate, db: Session = Depends(get_db)) -> Receipt:
    return receipt_service.create_receipt(db, payload)


@router.post("/ocr", response_model=ReceiptOCRPreview)
async def ocr_receipt(image: UploadFile = File(...)) -> ReceiptOCRPreview:
    result = await receipt_service.extract_from_image(image)
    paid_at = result.paid_at.date() if result.paid_at is not None else None
    return ReceiptOCRPreview(
        merchant=result.merchant,
        total=result.total,
        paid_at=paid_at,
        confidence=result.confidence,
    )


@router.post("/upload", response_model=ReceiptRead, status_code=status.HTTP_201_CREATED)
async def upload_receipt(
    merchant: str = Form(...),
    total: Decimal = Form(...),
    paid_at: date = Form(...),
    memo: str | None = Form(None),
    category_id: int | None = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> Receipt:
    payload = ReceiptCreate(
        merchant=merchant,
        total=total,
        paid_at=paid_at,
        memo=memo,
        category_id=category_id,
    )
    return await receipt_service.create_receipt_with_image(db, payload, image)


@router.patch("/{receipt_id}", response_model=ReceiptRead)
def update_receipt(
    receipt_id: int, payload: ReceiptUpdate, db: Session = Depends(get_db)
) -> Receipt:
    receipt = db.get(Receipt, receipt_id)
    if receipt is None:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return receipt_service.update_receipt(db, receipt, payload)


@router.delete("/{receipt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_receipt(receipt_id: int, db: Session = Depends(get_db)) -> None:
    receipt = db.get(Receipt, receipt_id)
    if receipt is None:
        raise HTTPException(status_code=404, detail="Receipt not found")
    db.delete(receipt)
    db.commit()
