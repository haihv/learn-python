import type { LessonModule } from "../types";

export const bytesModule: LessonModule = {
  type: "lesson",
  id: "07",
  slug: "bytes",
  title: "bytes, bytearray, and encode/decode",
  icon: "🔡",
  estimatedMinutes: 12,
  content: `# bytes, bytearray, and encode/decode

While Python strings (\`str\`) deal with text (Unicode characters), \`bytes\` and \`bytearray\` deal with raw binary data — sequences of integers from 0 to 255. Understanding the distinction is crucial for network programming, file I/O, and working with binary formats.

## The str vs bytes Distinction

In Python 3, \`str\` and \`bytes\` are completely separate types:

\`\`\`python
text = "Hello"        # str: Unicode characters
data = b"Hello"       # bytes: raw bytes

print(type(text))     # <class 'str'>
print(type(data))     # <class 'bytes'>

print(text[0])        # 'H'   (a str)
print(data[0])        # 72    (an int — ASCII value of 'H')

# Cannot mix str and bytes
# text + data        # TypeError!
# "Hello" == b"Hello" # False (different types)
\`\`\`

## Creating bytes

\`\`\`python
# bytes literal with b prefix
b1 = b"Hello, World!"
b2 = b'single quotes work too'

# bytes() constructor
b3 = bytes(5)              # Five zero bytes: b'\\x00\\x00\\x00\\x00\\x00'
b4 = bytes([72, 101, 108, 108, 111])  # From a list of integers
b5 = bytes(range(10))      # From an iterable

print(b4)   # b'Hello'
print(list(b4))  # [72, 101, 108, 108, 111]

# Hex representation
b6 = bytes.fromhex("48656c6c6f")  # b'Hello'
print(b6.hex())                    # '48656c6c6f'
\`\`\`

## bytes Operations

\`\`\`python
data = b"Hello, World!"

# Length and indexing
print(len(data))    # 13
print(data[0])      # 72 (int, not 'H'!)
print(data[-1])     # 33 (ASCII for '!')

# Slicing returns bytes
print(data[0:5])    # b'Hello'
print(data[::-1])   # b'!dlroW ,olleH' (reverse)

# in operator
print(b"World" in data)   # True
print(72 in data)          # True (integer 72 = 'H')

# Concatenation
part1 = b"Hello"
part2 = b", World"
combined = part1 + part2  # b'Hello, World'

# Repetition
print(b"ab" * 3)   # b'ababab'
\`\`\`

## bytearray — Mutable bytes

\`bytearray\` is the mutable counterpart of \`bytes\`. Use it when you need to modify binary data in place:

\`\`\`python
ba = bytearray(b"Hello")
print(type(ba))    # <class 'bytearray'>

# bytearray is mutable!
ba[0] = 74         # Change 'H' (72) to 'J' (74)
print(ba)          # bytearray(b'Jello')

ba.append(33)      # Append '!'
print(ba)          # bytearray(b'Jello!')

ba.extend(b" World")
print(ba)          # bytearray(b'Jello! World')

# Convert to bytes when done
frozen = bytes(ba)
print(type(frozen))  # <class 'bytes'>
\`\`\`

## Encoding: str → bytes

To convert text to bytes, you must specify an **encoding** — a mapping from characters to byte sequences. UTF-8 is the standard:

\`\`\`python
text = "Hello, 世界!"   # Contains non-ASCII characters

# encode() converts str to bytes
utf8_bytes = text.encode("utf-8")
print(utf8_bytes)
# b'Hello, \\xe4\\xb8\\x96\\xe7\\x95\\x8c!'
# The Chinese characters take 3 bytes each in UTF-8

utf16_bytes = text.encode("utf-16")
print(len(utf8_bytes))    # 14 bytes
print(len(utf16_bytes))   # 26 bytes (UTF-16 uses 2-4 bytes per char + BOM)

# ASCII encoding — fails on non-ASCII characters
try:
    ascii_bytes = "café".encode("ascii")
except UnicodeEncodeError as e:
    print(f"Error: {e}")
    # Error: 'ascii' codec can't encode character '\\xe9'

# Handle encoding errors
print("café".encode("ascii", errors="ignore"))    # b'caf' (skip bad chars)
print("café".encode("ascii", errors="replace"))   # b'caf?' (replace with ?)
print("café".encode("ascii", errors="xmlcharrefreplace"))  # b'caf&#233;'
\`\`\`

## Decoding: bytes → str

\`\`\`python
data = b'Hello, \\xe4\\xb8\\x96\\xe7\\x95\\x8c!'

# decode() converts bytes to str
text = data.decode("utf-8")
print(text)  # Hello, 世界!

# Wrong encoding produces garbage or errors
try:
    wrong = data.decode("latin-1")
    print(wrong)  # Garbled output — bytes have different meaning in latin-1
except UnicodeDecodeError:
    print("Decode failed")

# Handle decode errors
bad_data = b"Hello \\xff World"
safe = bad_data.decode("utf-8", errors="replace")
print(safe)   # Hello  World (replacement character)
\`\`\`

## Common Encodings

| Encoding | Description | Characters |
|----------|-------------|------------|
| UTF-8 | Variable-width, backward-compatible with ASCII | All Unicode |
| UTF-16 | 2 or 4 bytes per character | All Unicode |
| ASCII | 1 byte per character | 128 characters (English) |
| latin-1 | 1 byte per character | 256 characters (Western European) |
| cp1252 | Windows Western European | Similar to latin-1 |

**Always use UTF-8** unless you have a specific reason not to.

## Practical Use Cases

### Reading/Writing Binary Files

\`\`\`python
# Write bytes to a file
with open("data.bin", "wb") as f:
    f.write(b"\\x89PNG\\r\\n\\x1a\\n")  # PNG header

# Read bytes from a file
with open("data.bin", "rb") as f:
    header = f.read(8)
    print(header.hex())  # '89504e470d0a1a0a'
\`\`\`

### Network Data

\`\`\`python
import socket

# Network protocols send/receive bytes, not strings
# Always encode before sending, decode after receiving
message = "Hello, server!"
encoded = message.encode("utf-8")  # bytes for transmission

# After receiving:
received = b"Response from server"
decoded = received.decode("utf-8")  # str for processing
\`\`\`

### Checking File Signatures (Magic Bytes)

\`\`\`python
def is_png(data: bytes) -> bool:
    # PNG files start with these specific bytes
    return data[:8] == b"\\x89PNG\\r\\n\\x1a\\n"

def is_jpeg(data: bytes) -> bool:
    return data[:2] == b"\\xff\\xd8"

def is_pdf(data: bytes) -> bool:
    return data[:4] == b"%PDF"
\`\`\`
`,
  quiz: [
    {
      question: "What does b\"Hello\"[0] return in Python?",
      options: ["'H'", "72", "b'H'", "TypeError"],
      correctIndex: 1,
    },
    {
      question: "Which method converts a str to bytes?",
      options: [".tobytes()", ".encode()", ".decode()", ".as_bytes()"],
      correctIndex: 1,
    },
    {
      question: "What is the key difference between bytes and bytearray?",
      options: [
        "bytes stores text, bytearray stores binary",
        "bytes is immutable, bytearray is mutable",
        "bytes uses UTF-8, bytearray uses ASCII",
        "bytearray is just an alias for bytes",
      ],
      correctIndex: 1,
    },
  ],
};
