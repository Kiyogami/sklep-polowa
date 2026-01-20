from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime, timezone
import uuid

from database import db
from models_order import OrderIn, OrderOut
from dependencies import require_telegram_webapp


router = APIRouter(prefix="/api/orders", tags=["orders"])


def generate_order_id() -> str:
    now = datetime.now(timezone.utc)
    stamp = now.strftime("%Y%m%d")
    short = uuid.uuid4().hex[:6].upper()
    return f"ORD-{stamp}-{short}"


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    body: OrderIn,
    tg_data: dict = Depends(require_telegram_webapp),  # validate Telegram WebApp initData
):
    """Tworzenie zamówienia z WebAppa.

    Wymagana poprawna nagłówkowa autoryzacja Telegram WebApp przez X-Telegram-Init-Data.
    """
    now = datetime.now(timezone.utc)
    order_id = generate_order_id()

    # Weryfikacja: wideo wymagane tylko dla H2H
    requires_verification = body.delivery.method == "h2h"

    doc = {
        "id": order_id,
        "customer": body.customer.model_dump(),
        "items": [i.model_dump() for i in body.items],
        "delivery": body.delivery.model_dump(),
        "payment": body.payment.model_dump(),
        "verification": {
            **body.verification.model_dump(),
            "required": requires_verification,
            "status": "pending" if requires_verification else body.verification.status,
        },
        "status": "verification_pending" if requires_verification else "payment_confirmed",
        "createdAt": now.isoformat(),
        "updatedAt": now.isoformat(),
    }

    await db.orders.insert_one(doc)

    # Przygotuj dane do odpowiedzi (konwersja timestampów na datetime)
    out_doc = {
        **doc,
        "createdAt": now,
        "updatedAt": now,
    }
    return OrderOut(**out_doc)


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(order_id: str):
    doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")

    doc["createdAt"] = datetime.fromisoformat(doc["createdAt"])
    doc["updatedAt"] = datetime.fromisoformat(doc["updatedAt"])
    return OrderOut(**doc)


@router.get("", response_model=List[OrderOut])
async def list_orders():
    cursor = db.orders.find({}, {"_id": 0}).sort("createdAt", -1)
    docs = await cursor.to_list(length=200)
    out: List[OrderOut] = []
    for d in docs:
        d["createdAt"] = datetime.fromisoformat(d["createdAt"])
        d["updatedAt"] = datetime.fromisoformat(d["updatedAt"])
        out.append(OrderOut(**d))
    return out
