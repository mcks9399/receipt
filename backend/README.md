# Backend — Receipt API

FastAPI + SQLite + SQLAlchemy 2.x + Alembic.

## 실행

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
Copy-Item .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Swagger UI: http://localhost:8000/docs
- Health: http://localhost:8000/health

## 폴더

```
app/
  core/      Settings (pydantic-settings)
  db/        엔진, 세션, Declarative Base
  models/    SQLAlchemy ORM
  schemas/   Pydantic 입출력 스키마
  api/       FastAPI 라우터
  services/  비즈니스 로직
  ocr/       OCR provider 인터페이스 + NullProvider
alembic/     마이그레이션
storage/     업로드된 영수증 이미지 (gitignored)
tests/       pytest
```

## 마이그레이션

```powershell
alembic revision --autogenerate -m "메시지"
alembic upgrade head
```

## 테스트

```powershell
pytest
```
