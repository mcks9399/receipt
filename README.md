# Receipt — 영수증 지출관리 앱

영수증을 등록하고 카테고리별/월별 지출을 집계하는 개인 가계부 앱.

## 구조

```
receipt/
├── backend/    # FastAPI + SQLite + SQLAlchemy
└── frontend/   # Next.js (App Router) + TypeScript + Tailwind
```

- 백엔드는 8000 포트, 프론트엔드는 3000 포트에서 동작
- 인증 없음 (1차 버전 단일 사용자 가정)
- OCR은 인터페이스만 준비된 상태 (실제 구현은 추후)

## 빠른 시작 (Windows PowerShell)

### 최초 1회

**Backend**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
Copy-Item .env.example .env
alembic upgrade head
```

**Frontend**
```powershell
cd frontend
npm install
Copy-Item .env.local.example .env.local
```

### 일상 개발

터미널 A에서 백엔드:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

터미널 B에서 프론트엔드:
```powershell
cd frontend
npm run dev
```

- UI: http://localhost:3000
- API 문서: http://localhost:8000/docs

## 도메인

- **Receipt** — 가맹점명, 총액, 결제일, 카테고리, 메모, 이미지 경로
- **Category** — 식비 / 교통 / 생활 등
- **Stats** — 월별·카테고리별 집계

## DB 마이그레이션

모델을 수정한 뒤:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
alembic revision --autogenerate -m "메시지"
alembic upgrade head
```
