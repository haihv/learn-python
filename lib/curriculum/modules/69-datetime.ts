import type { LessonModule } from "../types";

export const datetimeModule: LessonModule = {
  type: "lesson",
  id: "69",
  slug: "datetime",
  title: "datetime, timedelta, strftime, timezone, UTC",
  icon: "📅",
  estimatedMinutes: 15,
  content: `# Python datetime Module

Python's \`datetime\` module provides everything you need to work with dates and times: creation, formatting, parsing, arithmetic, and timezone handling.

## Core Types

The module has four main types:

| Type | Description |
|------|-------------|
| \`datetime.datetime\` | Combined date and time |
| \`datetime.date\` | Date only (year, month, day) |
| \`datetime.time\` | Time only (hour, minute, second, microsecond) |
| \`datetime.timedelta\` | Duration between two points in time |

\`\`\`python
from datetime import datetime, date, time, timedelta

# datetime: year, month, day, hour, minute, second, microsecond
dt = datetime(2024, 3, 15, 14, 30, 0)
print(dt)           # 2024-03-15 14:30:00
print(dt.year)      # 2024
print(dt.month)     # 3
print(dt.day)       # 15
print(dt.hour)      # 14
print(dt.minute)    # 30

# date: year, month, day only
d = date(2024, 3, 15)
print(d)            # 2024-03-15

# time: hour, minute, second, microsecond
t = time(14, 30, 45, 500000)
print(t)            # 14:30:45.500000
\`\`\`

## Getting the Current Time

\`\`\`python
from datetime import datetime, timezone

# Local time (naive — no timezone info)
now = datetime.now()
print(now)           # e.g. 2024-03-15 14:30:22.123456

# datetime.utcnow() is DEPRECATED in Python 3.12+
# Use this instead:
utc_now = datetime.now(timezone.utc)
print(utc_now)       # 2024-03-15 14:30:22.123456+00:00

# today() returns just the date
today = datetime.today().date()
print(today)         # 2024-03-15
\`\`\`

> **Naive vs Aware**: A naive datetime has no timezone; an aware datetime carries a \`tzinfo\` object. Always prefer aware datetimes in production code to avoid subtle bugs when comparing or converting times.

## timedelta — Duration Arithmetic

\`timedelta\` represents a duration and supports arithmetic with datetime objects:

\`\`\`python
from datetime import datetime, timedelta

now = datetime(2024, 3, 15, 12, 0, 0)

# Create timedeltas
one_week = timedelta(weeks=1)
two_days = timedelta(days=2)
three_hours = timedelta(hours=3)
mixed = timedelta(days=1, hours=12, minutes=30)

# Add/subtract from a datetime
next_week = now + one_week
print(next_week)        # 2024-03-22 12:00:00

yesterday = now - two_days
print(yesterday)        # 2024-03-13 12:00:00

# Subtract two datetimes to get a timedelta
deadline = datetime(2024, 12, 31)
days_left = (deadline - now).days
print(f"Days until deadline: {days_left}")

# timedelta attributes
delta = timedelta(days=2, hours=5, minutes=30)
print(delta.days)         # 2
print(delta.seconds)      # 19800  (5*3600 + 30*60 = total seconds in partial day)
print(delta.total_seconds())  # 192600.0  (total across all components)
\`\`\`

## strftime — Formatting Dates

\`strftime\` converts a datetime to a formatted string using format codes:

\`\`\`python
from datetime import datetime

dt = datetime(2024, 3, 15, 14, 30, 45)

# Common format codes
print(dt.strftime("%Y-%m-%d"))          # 2024-03-15
print(dt.strftime("%d/%m/%Y"))          # 15/03/2024
print(dt.strftime("%B %d, %Y"))         # March 15, 2024
print(dt.strftime("%A, %B %d, %Y"))     # Friday, March 15, 2024
print(dt.strftime("%I:%M %p"))          # 02:30 PM
print(dt.strftime("%H:%M:%S"))          # 14:30:45
print(dt.strftime("%Y-%m-%dT%H:%M:%S")) # 2024-03-15T14:30:45
\`\`\`

| Code | Meaning | Example |
|------|---------|---------|
| \`%Y\` | 4-digit year | 2024 |
| \`%m\` | Month 01-12 | 03 |
| \`%d\` | Day 01-31 | 15 |
| \`%H\` | Hour 00-23 | 14 |
| \`%M\` | Minute 00-59 | 30 |
| \`%S\` | Second 00-59 | 45 |
| \`%A\` | Full weekday | Friday |
| \`%B\` | Full month name | March |
| \`%I\` | Hour 01-12 | 02 |
| \`%p\` | AM/PM | PM |
| \`%Z\` | Timezone name | UTC |

## strptime — Parsing Strings to datetime

\`strptime\` (string **p**arse **time**) is the inverse of \`strftime\`:

\`\`\`python
from datetime import datetime

# Parse a date string — format must match exactly
dt = datetime.strptime("15/03/2024 14:30:00", "%d/%m/%Y %H:%M:%S")
print(dt)          # 2024-03-15 14:30:00
print(type(dt))    # <class 'datetime.datetime'>

# Another example
dt2 = datetime.strptime("March 15, 2024", "%B %d, %Y")
print(dt2.year)    # 2024
\`\`\`

If the format string doesn't match the input, you get a \`ValueError\` — always wrap in \`try/except\` when parsing user input.

## ISO 8601 — fromisoformat and isoformat

Python 3.7+ supports ISO 8601 format directly:

\`\`\`python
from datetime import datetime, timezone

dt = datetime(2024, 3, 15, 14, 30, 0, tzinfo=timezone.utc)

# .isoformat() produces a standard ISO 8601 string
iso = dt.isoformat()
print(iso)    # 2024-03-15T14:30:00+00:00

# .fromisoformat() parses it back (Python 3.7+)
restored = datetime.fromisoformat(iso)
print(restored == dt)  # True
\`\`\`

ISO 8601 is the recommended format for storing or transmitting datetimes — it's unambiguous and universally supported.

## Timezone-Aware Datetimes with zoneinfo

Python 3.9 introduced the \`zoneinfo\` module (replaces the third-party \`pytz\`):

\`\`\`python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

# Create a UTC datetime (aware)
utc_dt = datetime(2024, 3, 15, 20, 0, 0, tzinfo=timezone.utc)
print(utc_dt)  # 2024-03-15 20:00:00+00:00

# Convert to New York time
ny_tz = ZoneInfo("America/New_York")
ny_dt = utc_dt.astimezone(ny_tz)
print(ny_dt)   # 2024-03-15 16:00:00-04:00  (EDT, UTC-4 in March)

# Convert to Tokyo
tokyo_dt = utc_dt.astimezone(ZoneInfo("Asia/Tokyo"))
print(tokyo_dt)  # 2024-03-16 05:00:00+09:00

# Create a timezone-aware datetime directly in a local zone
local_dt = datetime(2024, 3, 15, 14, 30, tzinfo=ZoneInfo("Europe/Paris"))
print(local_dt)  # 2024-03-15 14:30:00+01:00
\`\`\`

## Comparing and Sorting Datetimes

\`\`\`python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

dt1 = datetime(2024, 1, 1, tzinfo=timezone.utc)
dt2 = datetime(2024, 6, 1, tzinfo=timezone.utc)

print(dt1 < dt2)   # True
print(dt2 > dt1)   # True
print(dt1 == dt2)  # False

# Sort a list of datetimes
events = [
    datetime(2024, 3, 15),
    datetime(2024, 1, 1),
    datetime(2024, 6, 30),
]
events.sort()
print(events[0])  # 2024-01-01 00:00:00

# Warning: you cannot compare naive and aware datetimes
# datetime(2024,1,1) < datetime(2024,1,1, tzinfo=timezone.utc)  # TypeError!
\`\`\`

## Practical Example: Age Calculator

\`\`\`python
from datetime import date

def calculate_age(birthdate: date) -> int:
    today = date.today()
    # Subtract 1 if birthday hasn't occurred yet this year
    had_birthday = (today.month, today.day) >= (birthdate.month, birthdate.day)
    return today.year - birthdate.year - (0 if had_birthday else 1)

birth = date(1990, 7, 4)
print(f"Age: {calculate_age(birth)}")
\`\`\`
`,
  quiz: [
    {
      question:
        "What is the difference between a 'naive' and an 'aware' datetime in Python?",
      options: [
        "Naive datetimes use 12-hour format; aware datetimes use 24-hour format",
        "Naive datetimes have no timezone info; aware datetimes carry a tzinfo object",
        "Naive datetimes are created with datetime.now(); aware datetimes with datetime.utcnow()",
        "Naive datetimes store only the date; aware datetimes store date and time",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Which strftime format code produces the full month name (e.g. 'March')?",
      options: ["%m", "%M", "%B", "%b"],
      correctIndex: 2,
    },
    {
      question:
        "What does timedelta(days=1, hours=12).total_seconds() return?",
      options: ["36", "129600.0", "86400.0", "43200.0"],
      correctIndex: 1,
    },
  ],
};
