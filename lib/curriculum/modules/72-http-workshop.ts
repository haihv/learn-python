import type { WorkshopModule } from "../types";

export const httpWorkshop: WorkshopModule = {
  type: "workshop",
  id: "72",
  slug: "http-workshop",
  title: "Making Requests & Parsing JSON Responses",
  icon: "📡",
  estimatedMinutes: 20,
  description: "Make HTTP requests and parse JSON responses using urllib",
  steps: [
    {
      instruction:
        "Make a GET request to `https://httpbin.org/get` using `urllib.request.urlopen`. Read the response body, decode it as UTF-8, parse the JSON with `json.loads`, and print the `url` field from the response.",
      hint: "Use `with urllib.request.urlopen(url) as response:` to make the request. Call `response.read().decode('utf-8')` to get the string, then `json.loads(...)` to parse it. Access `data['url']` for the URL field.",
      starterCode: `import urllib.request
import json

url = "https://httpbin.org/get"

# Make the GET request
with urllib.request.urlopen(url) as response:
    # Read and decode the response body
    body = response.read().decode('utf-8')
    print(f"Status: {response.status}")

# Parse the JSON response
data = json.loads(body)

# Print specific fields
print(f"URL: {data['url']}")
print(f"Origin IP: {data['origin']}")
print(f"Headers sent: {list(data['headers'].keys())}")
`,
      validate: (code) =>
        code.includes("urllib.request") &&
        code.includes("json.loads") &&
        code.includes("urlopen"),
      successMessage:
        "Great! urllib.request.urlopen returns an http.client.HTTPResponse object. It behaves like a file — always read and decode the body. httpbin.org is a free service that echoes back your request details, making it perfect for testing.",
    },
    {
      instruction:
        "Use `urllib.parse.urlencode` to build a query string with `name=python` and `version=3`, then fetch `https://httpbin.org/get` with those parameters. Print the `args` field from the JSON response to verify the server received them.",
      hint: "Create a dict `{'name': 'python', 'version': '3'}`, pass it to `urllib.parse.urlencode`, then append to the base URL with `?`. Fetch the constructed URL and print `data['args']`.",
      starterCode: `import urllib.request
import urllib.parse
import json

base_url = "https://httpbin.org/get"

# Build query parameters safely
params = {'name': 'python', 'version': '3'}
query_string = urllib.parse.urlencode(params)
full_url = f"{base_url}?{query_string}"

print(f"Requesting: {full_url}")

with urllib.request.urlopen(full_url) as response:
    data = json.loads(response.read().decode('utf-8'))

# httpbin echoes back the query parameters under "args"
print(f"\\nArgs received by server: {data['args']}")
print(f"name = {data['args']['name']}")
print(f"version = {data['args']['version']}")
`,
      validate: (code) =>
        code.includes("urllib.parse.urlencode") &&
        code.includes("urllib.request") &&
        code.includes("json.loads"),
      successMessage:
        "Excellent! urllib.parse.urlencode handles percent-encoding automatically — spaces become %20 or +, & and = are escaped as needed. Never manually build query strings by string concatenation; it creates security vulnerabilities and breaks with special characters.",
    },
    {
      instruction:
        "Make a POST request to `https://httpbin.org/post` by sending a JSON body using `urllib.request.Request`. Set the `Content-Type` header to `application/json`. Print the `json` field from the response, which echoes back your posted data.",
      hint: "Encode your payload with `json.dumps(payload).encode('utf-8')`. Pass it as `data=` to `urllib.request.Request`. Set `method='POST'` and `headers={'Content-Type': 'application/json'}`. The response `data['json']` will contain your posted object.",
      starterCode: `import urllib.request
import json

url = "https://httpbin.org/post"

# Payload to send
payload = {
    "language": "python",
    "version": 3,
    "features": ["easy", "powerful", "readable"],
}

# Encode the body as UTF-8 bytes
body = json.dumps(payload).encode('utf-8')

# Build the request with method and headers
req = urllib.request.Request(
    url,
    data=body,
    method='POST',
    headers={
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
)

with urllib.request.urlopen(req) as response:
    result = json.loads(response.read().decode('utf-8'))

# "json" field contains the parsed body we sent
print(f"Method used: {result['method']}")
print(f"Data echoed back: {result['json']}")
print(f"Features: {result['json']['features']}")
`,
      validate: (code) =>
        code.includes("urllib.request.Request") &&
        code.includes("json.dumps") &&
        code.includes("encode") &&
        code.includes("Content-Type"),
      successMessage:
        "Well done! When you set data= on a urllib.request.Request, it automatically becomes a POST request. The Content-Type: application/json header tells the server how to interpret the body. Always encode the body to bytes before sending — urllib does not do this automatically.",
    },
    {
      instruction:
        "Add custom `User-Agent` and `Accept` headers to a GET request using `urllib.request.Request`. Fetch `https://httpbin.org/headers` and print the headers the server received, confirming your custom headers appear.",
      hint: "Pass a `headers={}` dict to `urllib.request.Request`. Set `'User-Agent': 'PythonCourse/1.0'` and `'Accept': 'application/json'`. httpbin.org/headers echoes all received headers under the `'headers'` key.",
      starterCode: `import urllib.request
import json

url = "https://httpbin.org/headers"

# Add custom headers via the Request object
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'PythonCourse/1.0',
        'Accept': 'application/json',
        'X-Request-ID': 'lesson-72',
    }
)

with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))

# httpbin echoes all received headers
received_headers = data['headers']
print("Headers received by server:")
for name, value in sorted(received_headers.items()):
    print(f"  {name}: {value}")

print(f"\\nOur User-Agent: {received_headers.get('User-Agent')}")
print(f"Our Accept:     {received_headers.get('Accept')}")
`,
      validate: (code) =>
        code.includes("urllib.request.Request") &&
        code.includes("User-Agent") &&
        code.includes("Accept") &&
        code.includes("headers"),
      successMessage:
        "Perfect! Custom headers are essential for real-world API usage. The User-Agent identifies your client (many APIs require it or use it for analytics). Accept tells the server what formats you understand. Authorization headers (e.g., 'Bearer token') are how most APIs handle authentication.",
    },
    {
      instruction:
        "Wrap a request to `https://httpbin.org/status/404` in a `try/except` block that catches `urllib.error.HTTPError`. Print the status code and reason. Also catch `urllib.error.URLError` for network-level failures.",
      hint: "Import `urllib.error`. Catch `urllib.error.HTTPError` (subclass of URLError) before `urllib.error.URLError`. Access `e.code` for the status number and `e.reason` for the text description.",
      starterCode: `import urllib.request
import urllib.error
import json

def safe_fetch(url: str) -> dict | None:
    """Fetch a URL, handling HTTP and network errors gracefully."""
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            return json.loads(response.read().decode('utf-8'))

    except urllib.error.HTTPError as e:
        # Server returned a 4xx or 5xx response
        print(f"HTTP Error: {e.code} {e.reason}")
        print(f"URL: {e.url}")
        return None

    except urllib.error.URLError as e:
        # Network failure: DNS resolution, connection refused, etc.
        print(f"Network Error: {e.reason}")
        return None

# Test with a 404 URL
print("--- Fetching 404 ---")
result = safe_fetch("https://httpbin.org/status/404")
print(f"Result: {result}")

# Test with a successful URL
print("\\n--- Fetching 200 ---")
result = safe_fetch("https://httpbin.org/status/200")
print(f"Status 200 returned: {result}")

# Test with a 500 URL
print("\\n--- Fetching 500 ---")
result = safe_fetch("https://httpbin.org/status/500")
print(f"Result: {result}")
`,
      validate: (code) =>
        code.includes("urllib.error.HTTPError") &&
        code.includes("urllib.error.URLError") &&
        code.includes("except") &&
        code.includes("e.code"),
      successMessage:
        "Outstanding! Proper error handling is what separates production-ready code from scripts. HTTPError is a subclass of URLError, so always catch HTTPError first — catching URLError first would swallow HTTP errors before you can read the status code. In real applications, log the error, potentially retry on 5xx, and never silently ignore failures.",
    },
  ],
};
