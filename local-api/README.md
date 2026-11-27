# Local registration API

`server.py` and `sample_request.json` are the client-supplied test receiver,
**unchanged**. Python 3 standard library only, nothing to install.

```bash
npm run api            # or: python3 local-api/server.py
curl http://localhost:8765/health
curl -i -H 'Content-Type: application/json' \
  -d @local-api/sample_request.json http://localhost:8765/api/register   # → 201
```

- Listens on `127.0.0.1:8765` only (not reachable from other machines).
- CORS allows only `http://localhost:5173` (the Vite dev server).
- Returns 201 for valid input, 422 for invalid fields, 400 for bad JSON.
- Does not store any submitted data.

If port 8765 is already taken by another program, `npm run api` fails with
"Address already in use". Free the port, then try again.
