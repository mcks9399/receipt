# Frontend — Receipt UI

Next.js (App Router) + TypeScript + Tailwind CSS.

## 실행

```powershell
npm install
Copy-Item .env.local.example .env.local
npm run dev
```

http://localhost:3000

## 폴더

```
app/         라우트 + 페이지 (App Router)
components/  재사용 UI 컴포넌트
lib/api/     백엔드 API 호출 래퍼
lib/format.ts 금액/날짜 포맷터
types/       백엔드 스키마와 대응하는 TS 타입
```

API 베이스 URL은 `NEXT_PUBLIC_API_BASE_URL` 환경변수로 주입 (기본값 `http://localhost:8000`).
