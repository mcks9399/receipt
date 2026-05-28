from fastapi.testclient import TestClient


def test_health(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_and_list_receipt(client: TestClient) -> None:
    payload = {
        "merchant": "스타벅스 강남점",
        "total": "6500.00",
        "paid_at": "2026-05-01",
        "memo": "아메리카노",
    }
    create_resp = client.post("/receipts", json=payload)
    assert create_resp.status_code == 201
    created = create_resp.json()
    assert created["merchant"] == payload["merchant"]
    assert created["id"] > 0

    list_resp = client.get("/receipts")
    assert list_resp.status_code == 200
    assert len(list_resp.json()) == 1


def test_ocr_factory_returns_null_provider() -> None:
    from app.ocr.factory import get_ocr_provider
    from app.ocr.null_provider import NullOCRProvider

    assert isinstance(get_ocr_provider(), NullOCRProvider)
