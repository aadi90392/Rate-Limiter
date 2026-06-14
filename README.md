# 🚦 Rate Limiter — Simple Per-User API Rate Limiting

A lightweight backend service built with **Node.js + Express** that implements a dual-layer rate limiter — restricting requests per **User ID** and **Client IP** using a sliding window algorithm.

---

## 📌 Features

- ✅ Rate limiting by **User ID** (via request header)
- ✅ Rate limiting by **Client IP** (auto-extracted)
- ✅ **Sliding Window** algorithm — no fixed resets, smooth limiting
- ✅ In-memory storage — ultra-fast, zero DB overhead
- ✅ Clean JSON error responses with proper HTTP status codes

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Storage:** In-Memory (Map) — optimal for single-server rate limiting

---

## ⚙️ Rate Limit Rules

| Limit Type | Header / Source | Max Requests | Window |
|---|---|---|---|
| Per User | `userId` header | 5 requests | 1 minute |
| Per IP | `x-forwarded-for` / `req.ip` | 20 requests | 1 minute |

> Both limits are checked on every request. If either limit is exceeded, the request is blocked.

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/aadi90392/Rate-Limiter.git
cd Rate-Limiter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
node index.js
```

Server runs on `http://localhost:3000`

---

## 📡 API Endpoint

### `GET /data`

Returns data if the request is within rate limits.

**Request Headers:**

```
userId: some-user-id
```

**Success Response `200`:**

```json
{
  "success": true,
  "message": "Request Successful",
  "timestamp": "2026-06-14T10:30:00.000Z"
}
```

**Rate Limit Exceeded `429`:**

```json
{
  "error": "Too many requests"
}
```

**Missing userId `400`:**

```json
{
  "error": "User ID is missing in the header"
}
```

---

## 🧪 Test with cURL

```bash
# Normal request
curl -H "userId: user123" http://localhost:3000/data

# Trigger user rate limit (run 6 times quickly)
for i in {1..6}; do curl -H "userId: user123" http://localhost:3000/data; done
```

---

## 🧠 How It Works

```
Incoming Request
      │
      ▼
Extract userId + IP
      │
      ▼
Clean old timestamps (> 1 min ago)
      │
      ├─ IP requests >= 20? → 429 Too Many Requests
      │
      ├─ User requests >= 5? → 429 Too Many Requests
      │
      └─ Both OK? → Push timestamp → next() → 200 OK
```

**Why In-Memory over DB?**
Rate limiters need to respond in **microseconds**. Database calls add unnecessary latency. For multi-server setups, **Redis** (also in-memory) is the industry standard — easily pluggable into this architecture.

---

## 📁 Project Structure

```
rate-limiter-task/
├── index.js          # Main server + rate limiter middleware
├── package.json
└── README.md
```

---

## 👨‍💻 Author

**Aditya Upadhyay**
- GitHub: [@aadi90392](https://github.com/aadi90392)
- Portfolio: [aditya-portfolio-eta-cyan.vercel.app](https://aditya-portfolio-eta-cyan.vercel.app)