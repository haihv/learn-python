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

# TODO: wrap csv_text in a file-like object using the io module
f = None

# TODO: pass f to the csv reader and print each row in a loop
pass
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

# TODO: wrap csv_text in a file-like object, then create a dict-based csv reader
# that uses the header row as field names; iterate and print name and price per row
f = None
pass
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

# Create a buffer to write into — you will need to pass this to the writer
buf = None  # replace with io.StringIO()

# TODO: create a csv writer object backed by buf
# write the header: ['product', 'category', 'stock']
# then write these data rows in one call:
#   ['Laptop', 'Electronics', 42]
#   ['Desk Chair', 'Furniture', 15]
#   ['Notebook', 'Stationery', 200]
pass

# Retrieve and print the CSV content
csv_output = buf.getvalue() if buf else ""
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

# TODO: create a StringIO buffer, then a dict-based csv writer with fieldnames below
# emit the header row automatically, then write all product dicts at once
buf = None  # replace with io.StringIO()
fieldnames = ['name', 'price', 'in_stock']
pass

print(buf.getvalue() if buf else "")
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
# TODO: wrap csv_text in a file-like buffer and use the dict-based reader
# For each row build a dict: name (str), price (convert to float then * 0.9, round 2dp), quantity (int)
discounted = []
# your reader loop here

print("Transformed data:")
for item in discounted:
    print(f"  {item['name']}: \${item['price']:.2f} x {item['quantity']}")

# Step 2: Write back to CSV
# TODO: create a new StringIO buffer, a dict-based writer with fieldnames below,
# emit the header, then write all discounted rows
out_buf = None  # replace with io.StringIO()
fieldnames_out = ['name', 'price', 'quantity']
pass

print("\\nOutput CSV:")
print(out_buf.getvalue() if out_buf else "")
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
