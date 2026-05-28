from decimal import Decimal

from pydantic import BaseModel


class CategoryStat(BaseModel):
    category_id: int | None
    category_name: str | None
    total: Decimal
    count: int


class MonthlyStat(BaseModel):
    year: int
    month: int
    total: Decimal
    count: int
