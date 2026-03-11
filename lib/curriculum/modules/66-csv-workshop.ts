import type { WorkshopModule } from "../types";

export const csvWorkshop: WorkshopModule = {
  type: "workshop",
  id: "66",
  slug: "csv-workshop",
  title: "csv.reader, csv.DictReader, csv.writer",
  icon: "📊",
  estimatedMinutes: 20,
  description: "Read and write CSV data using Python's csv module",
  steps: [
    {
      instruction:
        "Use `csv.reader` to parse a CSV string. Wrap the CSV text in `io.StringIO` to treat it as a file-like object, then iterate over the reader to print each row as a Python list. Notice how the header row is included as the first list.",
      hint: "Use `io.StringIO(csv_text)` to create a file-like object, then pass it to `csv.reader`. Iterate with a `for row in reader:` loop. Each `row` is a plain Python list of strings.",
      starterCode: `import csv
import io

csv_text = """name,price,quantity
Apple,1.50,100
Banana,0.75,150
Cherry,3.00,50"""

# Create a file-like object from the string
f = io.StringIO(csv_text)

# Create a csv.reader and iterate over rows
reader = csv.reader(f)
for row in reader:
    print(row)
`,
      validate: (code) =>
        code.includes("csv.reader") && code.includes("io.StringIO"),
      successMessage:
        "Great start! csv.reader gives you each row as a plain list of strings. Notice the header ['name', 'price', 'quantity'] is treated just like any other row — it's up to you to skip it with next(reader) if needed.",
    },
    {
      instruction:
        "Use `csv.DictReader` to parse the same CSV, this time accessing columns by name instead of index. Print the name and price of each product (skip the header — DictReader handles that automatically).",
      hint: "Pass the `io.StringIO` object to `csv.DictReader`. Each `row` is now an `OrderedDict` (or plain dict in Python 3.8+). Access fields as `row['name']`, `row['price']`, etc.",
      starterCode: `import csv
import io

csv_text = """name,price,quantity
Apple,1.50,100
Banana,0.75,150
Cherry,3.00,50"""

f = io.StringIO(csv_text)

# Use DictReader so columns are accessible by name
reader = csv.DictReader(f)
for row in reader:
    # Access by column name instead of index
    print(f"{row['name']}: \${row['price']} (qty: {row['quantity']})")
`,
      validate: (code) =>
        code.includes("csv.DictReader") && code.includes("io.StringIO"),
      successMessage:
        "Excellent! DictReader is much more readable than reader when the CSV has named columns. It automatically uses the first row as fieldnames. You can also pass fieldnames= explicitly if your CSV has no header row.",
    },
    {
      instruction:
        "Use `csv.writer` to write rows to a `StringIO` buffer, then print the result. Write a header row followed by three data rows. Use `writerow()` for single rows or `writerows()` for multiple at once.",
      hint: "Create a `io.StringIO()` buffer, pass it to `csv.writer`, call `writer.writerow(['col1', 'col2'])` for headers, then `writer.writerows([...])` for data. Finally call `buf.getvalue()` to retrieve the CSV string.",
      starterCode: `import csv
import io

# Create a buffer to write into
buf = io.StringIO()
writer = csv.writer(buf)

# Write the header row
writer.writerow(['product', 'category', 'stock'])

# Write multiple data rows at once
writer.writerows([
    ['Laptop', 'Electronics', 42],
    ['Desk Chair', 'Furniture', 15],
    ['Notebook', 'Stationery', 200],
])

# Retrieve and print the CSV content
csv_output = buf.getvalue()
print(csv_output)
print(f"Total characters written: {len(csv_output)}")
`,
      validate: (code) =>
        code.includes("csv.writer") &&
        code.includes("io.StringIO") &&
        (code.includes("writerow") || code.includes("writerows")),
      successMessage:
        "Well done! csv.writer automatically handles quoting (e.g. fields containing commas or quotes). It writes platform line endings by default — pass lineterminator='\\n' for consistent Unix line endings.",
    },
    {
      instruction:
        "Use `csv.DictWriter` to write a list of dictionaries to CSV. Specify the `fieldnames` list, call `writeheader()` to emit the header row, then `writerows()` with your list of dicts.",
      hint: "Create `csv.DictWriter(buf, fieldnames=['col1', 'col2'])`. Call `writer.writeheader()` before any data rows. Each dict in `writerows()` must contain the same keys as `fieldnames`.",
      starterCode: `import csv
import io

products = [
    {'name': 'Apple', 'price': 1.50, 'in_stock': True},
    {'name': 'Banana', 'price': 0.75, 'in_stock': True},
    {'name': 'Durian', 'price': 15.00, 'in_stock': False},
]

buf = io.StringIO()

# Define which fields to include (and their order)
fieldnames = ['name', 'price', 'in_stock']
writer = csv.DictWriter(buf, fieldnames=fieldnames)

# Write the header row automatically from fieldnames
writer.writeheader()

# Write all product dicts
writer.writerows(products)

print(buf.getvalue())
`,
      validate: (code) =>
        code.includes("csv.DictWriter") &&
        code.includes("fieldnames") &&
        code.includes("writeheader"),
      successMessage:
        "Perfect! DictWriter pairs naturally with DictReader — you can read CSV into dicts, transform them, and write back out. The fieldnames list controls column order and which keys to include, so extra keys in your dicts are simply ignored.",
    },
    {
      instruction:
        "Perform a full round-trip: read the fruits CSV using `DictReader`, convert `price` to float, apply a 10% discount, then write the updated data back to a new CSV string using `DictWriter`. Print both the transformed data and the final CSV.",
      hint: "After reading with DictReader, build a new list of dicts with `float(row['price']) * 0.9`. Use `round(..., 2)` to avoid floating-point noise. Then write with DictWriter using the same fieldnames.",
      starterCode: `import csv
import io

csv_text = """name,price,quantity
Apple,1.50,100
Banana,0.75,150
Cherry,3.00,50"""

# Step 1: Read and transform
reader = csv.DictReader(io.StringIO(csv_text))
discounted = []
for row in reader:
    discounted.append({
        'name': row['name'],
        'price': round(float(row['price']) * 0.9, 2),
        'quantity': int(row['quantity']),
    })

print("Transformed data:")
for item in discounted:
    print(f"  {item['name']}: \${item['price']:.2f} x {item['quantity']}")

# Step 2: Write back to CSV
out_buf = io.StringIO()
writer = csv.DictWriter(out_buf, fieldnames=['name', 'price', 'quantity'])
writer.writeheader()
writer.writerows(discounted)

print("\\nOutput CSV:")
print(out_buf.getvalue())
`,
      validate: (code) =>
        code.includes("csv.DictReader") &&
        code.includes("csv.DictWriter") &&
        code.includes("float(") &&
        code.includes("io.StringIO"),
      successMessage:
        "Outstanding! You've completed a full ETL (Extract-Transform-Load) pipeline in memory. This pattern scales to real files — just replace io.StringIO with open(filepath, newline='') for reading and open(outpath, 'w', newline='') for writing. The newline='' argument is important on Windows to prevent double line endings.",
    },
  ],
};
