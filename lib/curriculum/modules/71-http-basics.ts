import type { LessonModule } from "../types";

export const httpBasics: LessonModule = {
  type: "lesson",
  id: "71",
  slug: "http-basics",
  title: "urllib.request, HTTP concepts, status codes",
  icon: "🌐",
  estimatedMinutes: 15,
  content: `# HTTP Basics & urllib

HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web. Python's standard library includes \`urllib\` for making HTTP requests without any third-party dependencies.

## HTTP Methods

Each HTTP request uses a **method** (also called a verb) that describes the intended action:

| Method | Purpose | Has Body? |
|--------|---------|-----------|
| **GET** | Retrieve a resource | No |
| **POST** | Create a new resource | Yes |
| **PUT** | Replace a resource entirely | Yes |
| **PATCH** | Partially update a resource | Yes |
| **DELETE** | Delete a resource | No |

REST APIs follow these conventions:
- \`GET /users\` → list all users
- \`POST /users\` → create a new user
- \`GET /users/42\` → get user 42
- \`PUT /users/42\` → replace user 42
- \`PATCH /users/42\` → update specific fields of user 42
- \`DELETE /users/42\` → delete user 42

## HTTP Status Codes

The server always responds with a **status code** indicating success or failure:

**2xx — Success**
- \`200 OK\` — request succeeded, body contains the result
- \`201 Created\` — resource was successfully created (often after POST)
- \`204 No Content\` — succeeded but no body (often after DELETE)

**3xx — Redirection**
- \`301 Moved Permanently\` — resource has a new permanent URL
- \`302 Found\` — temporary redirect

**4xx — Client Errors** (your fault)
- \`400 Bad Request\` — malformed request syntax or invalid parameters
- \`401 Unauthorized\` — authentication required or failed
- \`403 Forbidden\` — authenticated but not permitted
- \`404 Not Found\` — resource doesn't exist
- \`422 Unprocessable Entity\` — valid syntax but semantic errors in body
- \`429 Too Many Requests\` — rate limit exceeded

**5xx — Server Errors** (server's fault)
- \`500 Internal Server Error\` — unexpected server-side crash
- \`502 Bad Gateway\` — upstream server failure
- \`503 Service Unavailable\` — server overloaded or in maintenance

## Making a Simple GET Request

\`urllib.request.urlopen\` opens a URL and returns a response object:

\`\`\`python
import urllib.request

url = "https://httpbin.org/get"

with urllib.request.urlopen(url) as response:
    # Read the response body as bytes, decode to string
    body = response.read().decode("utf-8")

    # Access status and headers
    print(f"Status: {response.status}")           # 200
    print(f"Content-Type: {response.headers['Content-Type']}")
    print(body[:200])  # first 200 chars
\`\`\`

The response object implements a context manager — always use \`with\` to ensure the connection is closed.

## Reading JSON Responses

Most modern APIs return JSON. Use the \`json\` module to parse it:

\`\`\`python
import urllib.request
import json

url = "https://jsonplaceholder.typicode.com/todos/1"

with urllib.request.urlopen(url) as response:
    data = json.loads(response.read().decode("utf-8"))

print(data["title"])      # "delectus aut autem"
print(data["completed"])  # False
print(data["userId"])     # 1
\`\`\`

## Building Query Parameters with urllib.parse

Never manually concatenate query strings — use \`urllib.parse.urlencode\`:

\`\`\`python
import urllib.request
import urllib.parse

# Build query string safely
params = urllib.parse.urlencode({
    "q": "python urllib",
    "page": 1,
    "per_page": 10,
})
print(params)  # q=python+urllib&page=1&per_page=10

url = f"https://httpbin.org/get?{params}"
with urllib.request.urlopen(url) as response:
    import json
    data = json.loads(response.read())
    print(data["args"])  # {'page': '1', 'per_page': '10', 'q': 'python urllib'}
\`\`\`

Use \`urllib.parse.quote\` to percent-encode a single string value (e.g., a search term with spaces or special characters):

\`\`\`python
import urllib.parse

raw = "hello world & goodbye!"
encoded = urllib.parse.quote(raw)
print(encoded)  # "hello%20world%20%26%20goodbye%21"

# quote_plus uses + for spaces (common for form data)
plus_encoded = urllib.parse.quote_plus(raw)
print(plus_encoded)  # "hello+world+%26+goodbye%21"
\`\`\`

## Custom Headers with urllib.request.Request

Use \`urllib.request.Request\` to add custom headers, change the method, or add a request body:

\`\`\`python
import urllib.request
import json

url = "https://httpbin.org/get"

# Create a Request object with custom headers
req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "MyApp/1.0 (Python)",
        "Accept": "application/json",
        "X-Custom-Header": "my-value",
    }
)

with urllib.request.urlopen(req) as response:
    data = json.loads(response.read())
    print(data["headers"])  # Shows your custom headers echoed back
\`\`\`

## POST Requests with a JSON Body

\`\`\`python
import urllib.request
import json

url = "https://httpbin.org/post"

# Encode the body as JSON bytes
payload = {"username": "alice", "action": "login"}
body = json.dumps(payload).encode("utf-8")

req = urllib.request.Request(
    url,
    data=body,           # setting data makes it a POST request
    method="POST",       # explicit is clearer
    headers={
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
)

with urllib.request.urlopen(req) as response:
    result = json.loads(response.read())
    print(result["json"])   # {'username': 'alice', 'action': 'login'}
    print(result["method"]) # POST
\`\`\`

## Error Handling

\`urllib.error.HTTPError\` is raised for 4xx and 5xx responses. \`urllib.error.URLError\` is raised for network-level failures (DNS, connection refused, timeout):

\`\`\`python
import urllib.request
import urllib.error

url = "https://httpbin.org/status/404"

try:
    with urllib.request.urlopen(url) as response:
        print(response.read())
except urllib.error.HTTPError as e:
    # Server responded with an error status
    print(f"HTTP Error: {e.code} {e.reason}")  # HTTP Error: 404 NOT FOUND
    # The error body is readable too:
    error_body = e.read().decode("utf-8")
    print(f"Body: {error_body[:100]}")
except urllib.error.URLError as e:
    # Network-level failure (no response from server)
    print(f"Network Error: {e.reason}")
except TimeoutError:
    print("Request timed out")
\`\`\`

## Setting Timeouts

Prevent your program from hanging indefinitely by always specifying a timeout:

\`\`\`python
import urllib.request

try:
    with urllib.request.urlopen("https://httpbin.org/delay/5", timeout=3) as response:
        print(response.read())
except TimeoutError:
    print("Request exceeded 3 second timeout")
\`\`\`

## A Complete Example

\`\`\`python
import urllib.request
import urllib.parse
import urllib.error
import json

def fetch_json(url: str, params: dict | None = None, timeout: int = 10) -> dict:
    """Fetch a JSON endpoint and return the parsed response."""
    if params:
        url = url + "?" + urllib.parse.urlencode(params)

    req = urllib.request.Request(
        url,
        headers={"Accept": "application/json", "User-Agent": "PythonClient/1.0"},
    )

    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}: {e.reason}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error: {e.reason}") from e

# Use it
data = fetch_json("https://jsonplaceholder.typicode.com/users", params={"_limit": 3})
for user in data:
    print(f"{user['id']}: {user['name']} <{user['email']}>")
\`\`\`
`,
  quiz: [
    {
      question:
        "Which HTTP status code indicates that a resource was successfully created by a POST request?",
      options: ["200 OK", "201 Created", "204 No Content", "202 Accepted"],
      correctIndex: 1,
    },
    {
      question:
        "What is the correct way to build query parameters for a URL in Python's standard library?",
      options: [
        "Manually concatenate strings: url + '?key=' + value",
        "Use urllib.parse.urlencode({'key': value})",
        "Use urllib.request.encode_params({'key': value})",
        "Use json.dumps({'key': value}) and append to the URL",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What exception does urllib raise when the server responds with a 404 status code?",
      options: [
        "urllib.error.URLError",
        "urllib.error.HTTPError",
        "ConnectionError",
        "FileNotFoundError",
      ],
      correctIndex: 1,
    },
  ],
};
