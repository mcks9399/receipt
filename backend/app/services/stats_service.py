from datetime import date
from decimal import Decimal

from sqlalchemy import extract, func, select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.receipt import Receipt
from app.schemas.stats import CategoryStat, MonthlyStat


def monthly_totals(db: Session, *, year: int | None = None) -> list[MonthlyStat]:
    year_col = extract("year", Receipt.paid_at).label("year")
    month_col = extract("month", Receipt.paid_at).label("month")
    stmt = select(
        year_col,
        month_col,
        func.coalesce(func.sum(Receipt.total), 0).label("total"),
        func.count(Receipt.id).label("count"),
    ).group_by(year_col, month_col).order_by(year_col.desc(), month_col.desc())

    if year is not None:
        start = date(year, 1, 1)
        end = date(year + 1, 1, 1)
        stmt = stmt.where(Receipt.paid_at >= start, Receipt.paid_at < end)

    rows = db.execute(stmt).all()
    return [
        MonthlyStat(year=int(r.year), month=int(r.month), total=Decimal(r.total), count=r.count)
        for r in rows
    ]


def category_totals(
    db: Session, *, year: int | None = None, month: int | None = None
) -> list[CategoryStat]:
    stmt = (
        select(
            Receipt.category_id,
            Category.name.label("category_name"),
            func.coalesce(func.sum(Receipt.total), 0).label("total"),
            func.count(Receipt.id).label("count"),
        )
        .join(Category, Category.id == Receipt.category_id, isouter=True)
        .group_by(Receipt.category_id, Category.name)
        .order_by(func.sum(Receipt.total).desc())
    )

    if year is not None:
        start = date(year, 1, 1)
        end = date(year + 1, 1, 1)
        stmt = stmt.where(Receipt.paid_at >= start, Receipt.paid_at < end)
    if year is not None and month is not None:
        start = date(year, month, 1)
        end_year, end_month = (year + 1, 1) if month == 12 else (year, month + 1)
        end = date(end_year, end_month, 1)
        stmt = stmt.where(Receipt.paid_at >= start, Receipt.paid_at < end)

    rows = db.execute(stmt).all()
    return [
        CategoryStat(
            category_id=r.category_id,
            category_name=r.category_name,
            total=Decimal(r.total),
            count=r.count,
        )
        for r in rows
    ]
