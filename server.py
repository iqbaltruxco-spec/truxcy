from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib import error, request
import json

API_BASE = "http://127.0.0.1:8000"
PORT = 3000
REQUEST_TIMEOUT = 30


class ProxyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/api/"):
            self.proxy_get()
            return
        super().do_GET()

    def proxy_get(self):
        api_path = self.path[len("/api") :]
        target_url = f"{API_BASE}{api_path}"

        try:
            with request.urlopen(target_url, timeout=REQUEST_TIMEOUT) as response:
                body = response.read()
                self.send_response(response.status)
                self.send_header(
                    "Content-Type",
                    response.headers.get("Content-Type", "application/json"),
                )
                self.end_headers()
                self.wfile.write(body)
        except error.HTTPError as exc:
            body = exc.read()
            self.send_response(exc.code)
            self.send_header(
                "Content-Type",
                exc.headers.get("Content-Type", "application/json"),
            )
            self.end_headers()
            self.wfile.write(body)
        except Exception as exc:
            payload = json.dumps({"error": str(exc)}).encode("utf-8")
            self.send_response(502)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(payload)

    def log_message(self, format, *args):
        print(format % args)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), ProxyHandler)
    print(f"truxcy frontend running at http://127.0.0.1:{PORT}")
    print(f"Proxying /api/* to {API_BASE}")
    server.serve_forever()
