import type { WorkshopModule } from "../types";

export const datetimeWorkshop: WorkshopModule = {
  type: "workshop",
  id: "70",
  slug: "datetime-workshop",
  title: "Parsing, Formatting & Timezone Conversion",
  icon: "🕐",
  estimatedMinutes: 20,
  description: "Work with dates, times, and timezones in Python",
  steps: [
    {
      instruction:
        "Create a `datetime(2024, 3, 15, 14, 30)` object and format it as the string `'March 15, 2024 at 02:30 PM'` using `strftime`. Also print the day of the week and the ISO week number.",
      hint: "Use `strftime('%B %d, %Y at %I:%M %p')` for the formatted string. Use `%A` for the full weekday name. Use `dt.isocalendar().week` or `strftime('%W')` for the week number.",
      starterCode: `from datetime import datetime

# Create the target datetime
dt = datetime(2024, 3, 15, 14, 30)

# Format as "March 15, 2024 at 02:30 PM"
formatted = dt.strftime('%B %d, %Y at %I:%M %p')
print(f"Formatted: {formatted}")

# Day of week
day_name = dt.strftime('%A')
print(f"Day of week: {day_name}")

# ISO week number
iso = dt.isocalendar()
print(f"ISO year={iso.year}, week={iso.week}, weekday={iso.weekday}")

# Quick sanity check
assert formatted == "March 15, 2024 at 02:30 PM"
print("\\nFormat assertion passed!")
`,
      validate: (code) =>
        code.includes("strftime") &&
        code.includes("%B") &&
        code.includes("datetime(2024"),
      successMessage:
        "Great! strftime is the go-to tool for human-readable date output. Remember: %I is 12-hour clock (01-12) while %H is 24-hour (00-23). Pair %I with %p to get AM/PM.",
    },
    {
      instruction:
        "Use `datetime.strptime` to parse the string `'15/03/2024 14:30:00'` back into a datetime object. Then re-format it in ISO 8601 format using `.isoformat()` and as a US-style date string.",
      hint: "The format string for '15/03/2024 14:30:00' is `'%d/%m/%Y %H:%M:%S'`. After parsing, call `.isoformat()` for ISO format. Use another `strftime` call for the US format.",
      starterCode: `from datetime import datetime

date_string = "15/03/2024 14:30:00"

# Parse using the correct format
dt = datetime.strptime(date_string, '%d/%m/%Y %H:%M:%S')
print(f"Parsed: {dt}")
print(f"Type: {type(dt).__name__}")

# Convert to ISO 8601
iso = dt.isoformat()
print(f"ISO 8601: {iso}")

# US-style format: "03/15/2024"
us_format = dt.strftime('%m/%d/%Y')
print(f"US format: {us_format}")

# Verbose format
verbose = dt.strftime('%A, %B %d, %Y at %I:%M %p')
print(f"Verbose: {verbose}")
`,
      validate: (code) =>
        code.includes("strptime") &&
        code.includes("%d/%m/%Y") &&
        code.includes("isoformat"),
      successMessage:
        "Excellent! strptime's format string must match the input exactly — every separator, space, and character counts. When parsing untrusted input, wrap in try/except ValueError to handle malformed dates gracefully.",
    },
    {
      instruction:
        "Use `timedelta` to calculate: (1) how many days from today until December 31, 2025, (2) what date it will be 90 days from today, and (3) what date it was 180 days ago.",
      hint: "Use `date.today()` for today. Subtract two dates to get a timedelta, then use `.days` to get the count. Add `timedelta(days=90)` to a date to advance it.",
      starterCode: `from datetime import date, timedelta

today = date.today()
print(f"Today: {today}")

# Days until a future deadline
deadline = date(2025, 12, 31)
days_until = (deadline - today).days
print(f"Days until Dec 31, 2025: {days_until}")

# 90 days from today
ninety_days = today + timedelta(days=90)
print(f"90 days from today: {ninety_days}")

# 180 days ago
six_months_ago = today - timedelta(days=180)
print(f"180 days ago: {six_months_ago}")

# Difference between the two computed dates
span = ninety_days - six_months_ago
print(f"\\nSpan between those two dates: {span.days} days")
print(f"That's {span.days // 7} weeks and {span.days % 7} days")
`,
      validate: (code) =>
        code.includes("timedelta") &&
        code.includes("days=") &&
        (code.includes("date.today()") || code.includes("datetime.today()")),
      successMessage:
        "Well done! Date arithmetic with timedelta is straightforward because Python handles month/year boundaries automatically — no need to worry about days-per-month. For month-based arithmetic (e.g., 'add 3 months'), look at the dateutil library's relativedelta.",
    },
    {
      instruction:
        "Given a list of date strings, find the earliest and latest dates using `datetime.strptime` for parsing and Python's built-in `min()` and `max()` functions.",
      hint: "Parse each string to a datetime object first. Store them in a list, then use `min(dates)` and `max(dates)`. Python compares datetime objects chronologically with < and >.",
      starterCode: `from datetime import datetime

date_strings = [
    "2023-11-05",
    "2024-01-20",
    "2022-07-14",
    "2024-03-01",
    "2023-04-30",
    "2021-12-25",
]

# Parse all strings into datetime objects
dates = [datetime.strptime(s, '%Y-%m-%d') for s in date_strings]

# Find earliest and latest
earliest = min(dates)
latest = max(dates)

print(f"Earliest: {earliest.strftime('%B %d, %Y')}")
print(f"Latest:   {latest.strftime('%B %d, %Y')}")
print(f"Span: {(latest - earliest).days} days")

# Sort all dates
sorted_dates = sorted(dates)
print("\\nAll dates in order:")
for d in sorted_dates:
    print(f"  {d.strftime('%Y-%m-%d')}")
`,
      validate: (code) =>
        code.includes("strptime") &&
        (code.includes("min(") || code.includes("max(")) &&
        code.includes("sorted"),
      successMessage:
        "Perfect! datetime objects are directly comparable with <, >, min(), max(), and sorted() because they implement __lt__ and friends. This makes sorting event lists, finding date ranges, and validating input dates very natural in Python.",
    },
    {
      instruction:
        "Create a UTC-aware datetime using `timezone.utc`, then convert it to `America/New_York` time using `zoneinfo.ZoneInfo`. Print both the UTC and local times, and show the UTC offset.",
      hint: "Import `ZoneInfo` from `zoneinfo`. Create the UTC datetime with `tzinfo=timezone.utc`. Call `.astimezone(ZoneInfo('America/New_York'))` to convert. The `.utcoffset()` method returns the offset as a timedelta.",
      starterCode: `from datetime import datetime, timezone
from zoneinfo import ZoneInfo

# Create a specific UTC moment
utc_dt = datetime(2024, 7, 4, 18, 0, 0, tzinfo=timezone.utc)
print(f"UTC time:        {utc_dt}")
print(f"UTC isoformat:   {utc_dt.isoformat()}")

# Convert to New York (handles DST automatically)
ny_tz = ZoneInfo("America/New_York")
ny_dt = utc_dt.astimezone(ny_tz)
print(f"\\nNew York time:   {ny_dt}")
print(f"UTC offset:      {ny_dt.utcoffset()}")
print(f"Timezone name:   {ny_dt.tzname()}")

# Also convert to a few other zones
for tz_name in ["Europe/London", "Asia/Tokyo", "Australia/Sydney"]:
    local = utc_dt.astimezone(ZoneInfo(tz_name))
    print(f"{tz_name:<25} {local.strftime('%Y-%m-%d %H:%M %Z')}")
`,
      validate: (code) =>
        code.includes("ZoneInfo") &&
        code.includes("America/New_York") &&
        code.includes("astimezone") &&
        code.includes("timezone.utc"),
      successMessage:
        "Excellent! zoneinfo.ZoneInfo (Python 3.9+) is the modern, built-in way to handle timezones. It reads from the system's IANA timezone database and correctly handles DST transitions — July 4 in New York is EDT (UTC-4), while January 4 would be EST (UTC-5). Always store times as UTC internally and convert to local time only for display.",
    },
  ],
};
