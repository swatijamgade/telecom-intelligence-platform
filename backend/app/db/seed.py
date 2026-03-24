from __future__ import annotations

import argparse
from datetime import UTC, datetime, timedelta
from random import Random

from sqlalchemy import delete, func, select

from app.db.session import SessionLocal
from app.modules.cdr.model import CDR, CallType


CITY_LOCATIONS: dict[str, list[str | None]] = {
    "Karachi": ["Saddar", "Clifton", "Gulshan", "Nazimabad", "Korangi"],
    "Lahore": ["Gulberg", "DHA", "Johar Town", "Model Town", "Wapda Town"],
    "Islamabad": ["F-7", "F-10", "G-11", "I-8", "Blue Area"],
    "Rawalpindi": ["Saddar", "Bahria Town", "Chaklala", "Peshawar Road", "Satellite Town"],
    "Faisalabad": ["D Ground", "People's Colony", "Madina Town", "Samanabad", "Kohinoor"],
    "Multan": ["Cantt", "Gulgasht", "Bosan Town", "Shah Rukn-e-Alam", "Mumtazabad"],
    "Peshawar": ["University Town", "Hayatabad", "Saddar", "Ring Road", "Warsak Road"],
    "Quetta": ["Jinnah Town", "Samungli Road", "Cantt", "Sariab Road", None],
}


def random_phone(rng: Random) -> str:
    return f"+92{rng.randint(300, 349)}{rng.randint(1000000, 9999999)}"


def existing_count() -> int:
    with SessionLocal() as db:
        return db.scalar(select(func.count(CDR.id))) or 0


def clear_existing() -> None:
    with SessionLocal() as db:
        db.execute(delete(CDR))
        db.commit()


def seed_records(records: int, seed: int) -> int:
    rng = Random(seed)
    now = datetime.now(UTC)
    rows: list[CDR] = []

    city_names = list(CITY_LOCATIONS.keys())
    for _ in range(records):
        city = rng.choice(city_names)
        locations = CITY_LOCATIONS[city]
        row = CDR(
            caller_number=random_phone(rng),
            receiver_number=random_phone(rng),
            call_type=rng.choice([CallType.incoming, CallType.outgoing]),
            duration=rng.randint(8, 3600),
            timestamp=now - timedelta(days=rng.randint(0, 60), hours=rng.randint(0, 23), minutes=rng.randint(0, 59)),
            city=city,
            location=rng.choice(locations),
        )
        rows.append(row)

    with SessionLocal() as db:
        db.add_all(rows)
        db.commit()

    return len(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed mock CDR data for local/dev use.")
    parser.add_argument("--records", type=int, default=1000, help="Number of CDR rows to insert.")
    parser.add_argument("--seed", type=int, default=20260321, help="Deterministic random seed.")
    parser.add_argument("--force", action="store_true", help="Clear existing CDR records before seeding.")
    args = parser.parse_args()

    if args.records <= 0:
        raise SystemExit("--records must be greater than 0")

    before = existing_count()

    if before > 0 and not args.force:
        print(f"CDR seed skipped: table already has {before} rows. Use --force to reseed.")
        return

    if before > 0 and args.force:
        clear_existing()

    inserted = seed_records(records=args.records, seed=args.seed)
    after = existing_count()
    print(f"CDR seed completed: inserted={inserted}, total_rows={after}")


if __name__ == "__main__":
    main()
