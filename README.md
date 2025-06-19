# 💰 Personal Finance Tracker

A fullstack web application to track income, expenses, and savings. Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **PostgreSQL**.

---

## 🔧 Features

- ✅ User Registration & Login (with hashed password)
- ✅ Add, Edit, Delete transactions
- ✅ Categorize transactions (e.g. food, bills, etc.)
- ✅ View total balance
- ✅ Filter by category or date
- ✅ Visualize data with charts
- ✅ Responsive, clean UI (mobile-first)

---

## 🛠 Tech Stack

| Layer        | Tool                          |
|--------------|-------------------------------|
| Frontend     | React + Next.js + TypeScript  |
| Styling      | Tailwind CSS                  |
| State/Form   | React Hook Form + Zod         |
| Backend API  | Next.js API Routes (REST)     |
| ORM          | Prisma                        |
| Database     | PostgreSQL (Docker)           |
| Auth         | JSON Web Token (JWT)          |

---

## 🚀 Getting Started (Dev)

### 1. Clone this repo

```bash
git clone https://github.com/your-username/personal-finance-tracker.git
cd personal-finance-tracker
```

##  Start PostgreSQL with Docker
```bash
docker-compose up -d
```


## Setup environment
```bash
cp .env.example .env
```


## Install dependencies
```bash
cd frontend
npm install
```

## Apply database schema
```bash
npx prisma migrate dev --name init
```

## RUN
```bash
npm run dev
```

## RUN Database
```bash
npx prisma studio
```

## Roadmap
 Setup database with Prisma + PostgreSQL
 Register / Login API
 Frontend auth form
 Transaction CRUD
 Charts (Recharts or Chart.js)
 Export to CSV
 Dark mode toggle
 Unit tests