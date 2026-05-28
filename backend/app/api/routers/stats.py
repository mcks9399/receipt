from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.stats import CategoryStat, MonthlyStat
from app.services import stats_service

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/monthly", response_model=list[MonthlyStat])
def monthly_stats(year: int | None = None, db: Session = Depends(get_db)) -> list[MonthlyStat]:
    return stats_service.monthly_totals(db, year=year)


@router.get("/by-category", response_model=list[CategoryStat])
def category_stats(
    year: int | None = None, month: int | None = None, db: Session = Depends(get_db)
) -> list[CategoryStat]:
    return stats_service.category_totals(db, year=year, month=month)
