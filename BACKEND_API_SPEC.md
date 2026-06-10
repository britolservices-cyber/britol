# Britol Group — Backend API Specification

Complete specification of all frontend forms and the API endpoints required to support them.

---

## Overview

The website has **3 forms** that require backend API endpoints.

| Method | Endpoint | Form | Status |
|--------|----------|------|--------|
| `POST` | `/api/send-booking` | Schedule a Cleaning (modal) | ✅ Built |
| `POST` | `/api/send-quote` | Get a Free Quote (contact section) | ⬜ Not built |
| `POST` | `/api/subscribe` | Newsletter / Mailing List | ⬜ Not built |

---

## Environment Variables

```env
RESEND_API_KEY=re_xxxxxxxxx   # Resend email service API key
PORT=3000                      # Optional — defaults to 3000
```

---

## Form 1 — Schedule a Cleaning

**Endpoint:** `POST /api/send-booking`  
**Trigger:** "Confirm Booking" button on Step 4 of the scheduling modal  
**Action:** Sends a formatted HTML booking email to `britolservices@gmail.com`, with `reply-to` set to the client's email address.

### Form Fields

| Field | HTML Element ID | Input Type | Required | Possible Values |
|-------|----------------|------------|----------|-----------------|
| `service` | `smSelected` (JS variable) | Card selection | **Yes** | `Office Cleaning`, `Body Corporate & Strata`, `Medical Centre`, `Restaurant / Café`, `Carpet Cleaning`, `Childcare Centre` |
| `frequency` | `smFreq` | `<select>` | **Yes** | `2 times per week (recommended)`, `3 times per week`, `Daily`, `Once per week`, `Fortnightly`, `One-off clean` |
| `days` | `smDays` | `<select>` | **Yes** | `Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday` |
| `startDate` | `smStartDate` | `<input type="date">` | No | `YYYY-MM-DD` format, or `"To be confirmed"` |
| `time` | `smTime` | `<select>` | **Yes** | `To be confirmed`, `Morning (6am – 9am)`, `Business hours (9am – 5pm)` |
| `name` | `smName` | `<input type="text">` | **Yes** | Full name string |
| `phone` | `smPhone` | `<input type="tel">` | **Yes** | Phone number string |
| `email` | `smEmail` | `<input type="email">` | **Yes** | Valid email address |
| `address` | `smAddress` | `<input type="text">` | No | Site / property address |
| `notes` | `smNotes` | `<textarea>` | No | Additional instructions, access notes, etc. |

### Request

```http
POST /api/send-booking
Content-Type: application/json
```

```json
{
  "service": "Office Cleaning",
  "frequency": "2 times per week (recommended)",
  "days": "Monday",
  "startDate": "2026-06-20",
  "time": "Morning (6am – 9am)",
  "name": "John Smith",
  "phone": "0400 000 000",
  "email": "john@example.com",
  "address": "123 Example St, Dandenong VIC 3175",
  "notes": "Please use eco-friendly products only."
}
```

### Responses

**Success — `200 OK`**
```json
{
  "success": true,
  "id": "resend-email-id"
}
```

**Validation Error — `400 Bad Request`**
```json
{
  "error": "Name, phone and email are required."
}
```

**Server Error — `500 Internal Server Error`**
```json
{
  "error": "Failed to send email. Please try again."
}
```

### Validation Rules

- `name`, `phone`, and `email` are required — return `400` if missing
- `email` must be a valid email format
- All other fields are optional; use `"To be confirmed"` or `"—"` as fallbacks in the email

---

## Form 2 — Get a Free Quote

**Endpoint:** `POST /api/send-quote`  
**Trigger:** Submit button on the "Get a Free Eco-Friendly Cleaning Quote" form in the contact section  
**Action:** Sends a quote enquiry email to `britolservices@gmail.com`.

### Form Fields

| Field | HTML Element ID | Input Type | Required | Possible Values |
|-------|----------------|------------|----------|-----------------|
| `name` | `quoteName` | `<input type="text">` | **Yes** | Full name string |
| `email` | `quoteEmail` | `<input type="email">` | **Yes** | Valid email address |
| `phone` | `quotePhone` | `<input type="tel">` | **Yes** | Phone number string |
| `service` | `quoteService` | `<select>` | No | `office`, `medical`, `carpet`, `strata`, `childcare`, `retail` |
| `message` | `quoteMessage` | `<textarea>` | No | Free-text description of cleaning needs |

### Service Option Mapping

| Value | Label |
|-------|-------|
| `office` | Office Cleaning |
| `medical` | Medical Centre Cleaning |
| `carpet` | Carpet Cleaning |
| `strata` | Body Corporate & Strata |
| `childcare` | Childcare Centre Cleaning |
| `retail` | Retail & Common Area |

### Request

```http
POST /api/send-quote
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "0411 111 111",
  "service": "medical",
  "message": "We need daily cleaning for our clinic in Frankston."
}
```

### Responses

**Success — `200 OK`**
```json
{
  "success": true
}
```

**Validation Error — `400 Bad Request`**
```json
{
  "error": "Name, phone and email are required."
}
```

**Server Error — `500 Internal Server Error`**
```json
{
  "error": "Failed to send email. Please try again."
}
```

### Validation Rules

- `name`, `phone`, and `email` are required — return `400` if missing
- `email` must be a valid email format
- `service` and `message` are optional

---

## Form 3 — Newsletter Subscribe

**Endpoint:** `POST /api/subscribe`  
**Trigger:** Subscribe button on the "Join South East Melbourne's Eco-Conscious Businesses" mailing list form  
**Action:** Save the subscriber email to a database and/or send a welcome confirmation email.

### Form Fields

| Field | HTML Element | Input Type | Required |
|-------|-------------|------------|----------|
| `email` | Unnamed `<input type="email">` inside `#mailingForm` | `<input type="email">` | **Yes** |

### Request

```http
POST /api/subscribe
Content-Type: application/json
```

```json
{
  "email": "subscriber@example.com"
}
```

### Responses

**Success — `200 OK`**
```json
{
  "success": true
}
```

**Validation Error — `400 Bad Request`**
```json
{
  "error": "A valid email address is required."
}
```

**Server Error — `500 Internal Server Error`**
```json
{
  "error": "Failed to subscribe. Please try again."
}
```

### Validation Rules

- `email` is required and must be a valid email format — return `400` otherwise

---

## General Rules for All Endpoints

1. **Always return JSON** — never return an empty body or HTML error page
2. **Content-Type** — all requests from the frontend use `Content-Type: application/json`
3. **CORS** — if the backend is on a different origin than the frontend, add a CORS header:
   ```
   Access-Control-Allow-Origin: https://www.britolgroup.com.au
   ```
4. **Validate server-side** — do not rely on frontend-only validation
5. **Email format** — use a regex or library (e.g. `validator.js`) to verify email addresses
6. **Error format** — always use `{ "error": "message" }` for errors and `{ "success": true }` for success

---

## Frontend Fetch Pattern

All three forms use this pattern in the browser:

```js
const response = await fetch('/api/<endpoint>', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

let result = {};
try {
  result = await response.json();
} catch (_) {
  // handles empty / non-JSON response gracefully
}

if (!response.ok) {
  throw new Error(result.error || 'Server error. Please try again.');
}
```

---

## Owner Email

All booking and quote emails are sent to:

```
britolservices@gmail.com
```

The `reply-to` header should be set to the **client's email address** so the owner can reply directly from their inbox.

---

## Email Service

The project uses **[Resend](https://resend.com)** for transactional email.

```js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Britol Group <onboarding@resend.dev>',
  to: 'britolservices@gmail.com',
  replyTo: clientEmail,
  subject: '...',
  html: '...'
});
```

> **Note:** The `from` address must use a verified domain in Resend. On the free plan, `onboarding@resend.dev` can only send to the account owner's email. To send to any address (including `britolservices@gmail.com`), add and verify a custom domain in the [Resend dashboard](https://resend.com/domains).
