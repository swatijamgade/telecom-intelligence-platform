from __future__ import annotations

import argparse
import csv
from datetime import UTC, datetime, timedelta
from pathlib import Path
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


def normalize_header(value: str) -> str:
    return "".join(ch.lower() if ch.isalnum() else "_" for ch in value).strip("_")


def pick_value(row: dict[str, str], keys: list[str]) -> str:
    for key in keys:
        value = row.get(key, "").strip()
        if value:
            return value
    return ""


def normalize_phone(value: str) -> str:
    text = str(value or "").strip()
    if not text:
        return ""
    digits = "".join(ch for ch in text if ch.isdigit())
    if text.startswith("+"):
        return f"+{digits[:19]}"
    return digits[:20]


def normalize_call_type(value: str) -> CallType:
    text = str(value or "").strip().lower()
    if text in {"true", "1", "incoming", "in"}:
        return CallType.incoming
    if text in {"false", "0", "outgoing", "out"}:
        return CallType.outgoing
    if "in" in text:
        return CallType.incoming
    return CallType.outgoing


def parse_duration(value: str) -> int:
    text = str(value or "").strip()
    if not text:
        return 0
    if text.isdigit():
        return int(text)
    if ":" in text:
        parts = [part.strip() for part in text.split(":")]
        if all(part.isdigit() for part in parts):
            nums = [int(part) for part in parts]
            if len(nums) == 3:
                return nums[0] * 3600 + nums[1] * 60 + nums[2]
            if len(nums) == 2:
                return nums[0] * 60 + nums[1]
    numeric = "".join(ch for ch in text if ch.isdigit() or ch == ".")
    if numeric and numeric != ".":
        return int(float(numeric))
    return 0


def parse_timestamp(value: str) -> datetime:
    text = str(value or "").strip()
    if not text:
        return datetime.now(UTC)
    try:
        parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d"):
            try:
                parsed = datetime.strptime(text, fmt)
                break
            except ValueError:
                continue
        else:
            return datetime.now(UTC)
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=UTC)
    return parsed.astimezone(UTC)


def discover_default_csv_path() -> Path | None:
    module_path = Path(__file__).resolve()
    candidates = [
        Path.cwd() / "mock_cdr.csv",
        module_path.parents[2] / "mock_cdr.csv",
        module_path.parents[3] / "mock_cdr.csv",
        Path("/app/mock_cdr.csv"),
    ]
    for path in candidates:
        if path.exists():
            return path
    return None


def random_phone(rng: Random) -> str:
    return f"+92{rng.randint(300, 349)}{rng.randint(1000000, 9999999)}"


def existing_count() -> int:
    with SessionLocal() as db:
        return db.scalar(select(func.count(CDR.id))) or 0


def clear_existing() -> None:
    with SessionLocal() as db:
        db.execute(delete(CDR))
        db.commit()


def seed_from_csv(csv_path: Path, records: int | None = None) -> int:
    rows: list[CDR] = []
    with csv_path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        if not reader.fieldnames:
            raise SystemExit(f"CDR seed failed: CSV has no header row ({csv_path})")

        for raw in reader:
            normalized_row = {
                normalize_header(str(key)): str(value or "").strip()
                for key, value in raw.items()
                if key is not None
            }
            caller_number = normalize_phone(
                pick_value(
                    normalized_row,
                    ["caller_number", "callernumber", "caller_no", "caller", "source", "from"],
                )
            )
            receiver_number = normalize_phone(
                pick_value(
                    normalized_row,
                    ["receiver_number", "receivernumber", "receiver_no", "receiver", "destination", "to"],
                )
            )
            if not caller_number or not receiver_number:
                continue

            city = pick_value(normalized_row, ["city", "caller_city", "location_city"]) or "Unknown"
            location = pick_value(normalized_row, ["location", "area", "district"]) or None
            call_type = normalize_call_type(
                pick_value(
                    normalized_row,
                    ["call_type", "type", "call_direction", "calldirection", "direction"],
                )
            )
            duration = parse_duration(
                pick_value(
                    normalized_row,
                    ["duration", "duration_sec", "duration_seconds", "seconds", "call_duration", "callduration"],
                )
            )
            timestamp = parse_timestamp(
                pick_value(
                    normalized_row,
                    ["timestamp", "datetime", "date_time", "date", "call_start_time", "callstarttime", "time"],
                )
            )
            rows.append(
                CDR(
                    caller_number=caller_number,
                    receiver_number=receiver_number,
                    call_type=call_type,
                    duration=duration,
                    timestamp=timestamp,
                    city=city,
                    location=location,
                )
            )
            if records is not None and len(rows) >= records:
                break

    if not rows:
        raise SystemExit(f"CDR seed failed: no valid rows found in {csv_path}")

    with SessionLocal() as db:
        db.add_all(rows)
        db.commit()

    return len(rows)


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
    parser.add_argument(
        "--records",
        type=int,
        default=None,
        help="Limit records from CSV, or number of random records when --random is used.",
    )
    parser.add_argument("--seed", type=int, default=20260321, help="Deterministic random seed.")
    parser.add_argument("--csv", type=str, default=None, help="CSV path (default: auto-detect mock_cdr.csv).")
    parser.add_argument("--random", action="store_true", help="Ignore CSV and generate random rows.")
    parser.add_argument("--force", action="store_true", help="Clear existing CDR records before seeding.")
    args = parser.parse_args()

    if args.records is not None and args.records <= 0:
        raise SystemExit("--records must be greater than 0")

    before = existing_count()

    if before > 0 and not args.force:
        print(f"CDR seed skipped: table already has {before} rows. Use --force to reseed.")
        return

    if before > 0 and args.force:
        clear_existing()

    csv_path: Path | None = None
    if args.csv:
        csv_path = Path(args.csv).expanduser().resolve()
        if not csv_path.exists():
            raise SystemExit(f"CDR seed failed: CSV not found at {csv_path}")
    else:
        csv_path = discover_default_csv_path()

    if not args.random and csv_path is not None:
        inserted = seed_from_csv(csv_path=csv_path, records=args.records)
        source = f"csv:{csv_path}"
    else:
        if csv_path is None and not args.random:
            print("CDR seed: mock_cdr.csv not found, falling back to random data.")
        record_count = args.records or 1000
        inserted = seed_records(records=record_count, seed=args.seed)
        source = f"random(seed={args.seed})"

    after = existing_count()
    print(f"CDR seed completed: source={source}, inserted={inserted}, total_rows={after}")


if __name__ == "__main__":
    main()
