from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ReceiptBase(BaseModel):
    merchant: str = Field(min_length=1, max_length=200)
    total: Decimal = Field(ge=0)
    paid_at: date
    memo: str | None = None
    category_id: int | None = None


class ReceiptCreate(ReceiptBase):
    pass


class ReceiptUpdate(BaseModel):
    merchant: str | None = Field(default=None, min_length=1, max_length=200)
    total: Decimal | None = Field(default=None, ge=0)
    paid_at: date | None = None
    memo: str | None = None
    category_id: int | None = None


class ReceiptRead(ReceiptBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_path: str | None
    created_at: datetime
    updated_at: datetime


class ReceiptOCRPreview(BaseModel):
    merchant: str | None = None
    total: Decimal | None = None
    paid_at: date | None = None
    confidence: float | None = None
