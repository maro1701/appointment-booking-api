# Appointment Booking API

A REST API for service-based businesses (barbershops, tutors, coaches) to manage appointments with automated email reminders. Built with Node.js, Express, PostgreSQL, BullMQ, and Redis.

---

## Features

- JWT authentication with role-based access (provider / client)
- Providers create services and availability slots
- Clients browse services and book appointments
- Slot locking — booked slots cannot be double-booked
- Automated reminder emails queued via BullMQ 24hrs before appointments
- Booking cancellation removes queued reminder job from Redis
- ACID transactions on booking creation
- Zod input validation
- Global error handling

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)
- **Queue:** BullMQ
- **Cache/Queue Storage:** Redis
- **Email:** Nodemailer
- **Validation:** Zod
- **Deployment:** Render

---

## Architecture

```
HTTP Request
     │
  Routes         → maps URLs to controller functions
     │
  Middleware     → auth (JWT verify) + role check + Zod validation
     │
  Controllers    → unpacks req, calls service, sends res
     │
  Services       → business logic, transactions, queue jobs
     │
  Repositories   → all SQL queries
     │
  PostgreSQL

Background:
  BullMQ Worker  → watches Redis queue, fires emails when delay expires
```

```
src/
├── config/
│   ├── db.js                # PostgreSQL connection pool
│   ├── redis.js             # Redis connection (ioredis)
│   └── queue.js             # BullMQ queue instance
├── middlewares/
│   ├── auth.middleware.js   # JWT verification → req.user
│   ├── role.middleware.js   # Role-based route protection
│   └── validate.middleware.js # Zod schema validation
├── modules/
│   ├── users/
│   ├── services/
│   ├── availability/
│   ├── bookings/
│   └── utils/
│       ├── email.js         # Nodemailer send function
│       ├── hash.js          # bcrypt helpers
│       ├── jwt.js           # sign and verify tokens
│       ├── schemas.js       # Zod schemas
│       └── error.js         # Global error handler
├── workers/
│   └── reminder.worker.js  # BullMQ worker — sends reminder emails
├── app.js
└── server.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Redis 5.0+ (or Docker)

### Installation

```bash
git clone https://github.com/maro1701/appointment-booking-api.git
cd appointment-booking-api
npm install
```

### Redis via Docker

```bash
docker run -d -p 6379:6379 --name redis redis:7
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/appointments
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

### Database Setup

```bash
psql -U postgres -d appointments -f schema.sql
```

### Run Locally

```bash
npm run dev
```

---

## Roles

| Role | What they can do |
|------|-----------------|
| `provider` | Register, create services, add availability slots, view bookings |
| `client` | Register, browse services, browse slots, book appointments, cancel bookings |

---

## API Reference

All protected routes require:
```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users/register` | Register a new user | No |
| POST | `/users/login` | Login and receive JWT | No |

**Request body:**
```json
{
  "email": "user@email.com",
  "password": "123456",
  "role": "provider"
}
```

---

### Services

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/services` | Create a service | Yes | provider |
| GET | `/services` | List all services | No | — |
| GET | `/services/:id` | Get service by ID | No | — |

**Create service body:**
```json
{
  "name": "Skin Fade",
  "duration": 30,
  "price": 20
}
```

---

### Availability

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/availability` | Add a time slot | Yes | provider |
| GET | `/availability` | List all open slots | No | — |
| GET | `/availability/:id` | Get slot by ID | No | — |

**Create slot body:**
```json
{
  "startTime": "2026-03-20T09:00:00",
  "endTime": "2026-03-20T09:30:00"
}
```

---

### Bookings

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/bookings` | Book an appointment | Yes | client |
| GET | `/bookings` | List my bookings | Yes | any |
| DELETE | `/bookings/:id` | Cancel booking | Yes | client |

**Create booking body:**
```json
{
  "serviceId": "uuid",
  "slotId": "uuid"
}
```

**What happens on booking:**
1. Slot is locked (`is_booked = true`)
2. Booking saved with `status: confirmed`
3. Reminder email job queued in BullMQ with 24hr delay
4. `job_id` saved to booking for later cancellation

**What happens on cancellation:**
1. Booking ownership verified
2. BullMQ job removed from Redis queue
3. Slot unlocked (`is_booked = false`)
4. Booking deleted

---

## Queue Flow

```
Client books appointment
        │
        ├── booking saved to PostgreSQL
        ├── slot locked
        ├── reminderQueue.add({ clientEmail, startTime, bookingId }, { delay: 24hrs })
        └── API responds 201 immediately

Separately (reminder.worker.js):
        │
        └── 24hrs before appointment
                  │
                  └── worker picks job from Redis
                            │
                            └── sendReminderEmail()
                                      │
                                      └── reminder_sent = true in DB
```

---

## Database Schema

```sql
users        → id, email, password, role, created_at
services     → id, provider_id, name, duration, price, created_at
availability → id, provider_id, start_time, end_time, is_booked
bookings     → id, client_id, provider_id, service_id, slot_id,
               status, reminder_sent, job_id, created_at
```

All tables use UUID primary keys with `gen_random_uuid()` defaults.
Foreign keys enforce cascade deletion throughout.

---

## Deployment

Deployed on Render with managed PostgreSQL. Redis hosted on Upstash.

Environment variables configured securely in Render dashboard — never committed to the repository.
