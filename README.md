# University Admission Maintenance System

UAMS is a training/demo full-stack student portal for managing university admissions, fee payments, and supporting documents.

## Tech stack

- React, Vite, Tailwind CSS
- Spring Boot, Hibernate/JPA, MySQL
- Razorpay/demo payment flow

## Features

- Student login and protected portal routes
- Student dashboard, admission details, and profile
- Fee summary, payment history, and Razorpay/demo payment checkout
- Document upload, browser view, download, and deletion
- Responsive sidebar layout for desktop, tablet, and mobile

## Project structure

```text
university-backend/   Spring Boot REST API
university-frontend/  React student portal
uploads/              Local document storage (not committed)
```

## Backend setup

1. Create a MySQL database matching the existing schema.
2. Create `university-backend/src/main/resources/application-local.properties` with local datasource and Razorpay configuration. Keep it out of Git.
3. From `university-backend`, run `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`).

The API runs on `http://localhost:8081` by default.

## Frontend setup

1. From `university-frontend`, run `npm install`.
2. Run `npm run dev`.
3. Open the Vite URL shown in the terminal.

## Demo login

Use a student that exists in your local database, for example:

- Email: `sohail@gmail.com`
- Password: `student123`

Payment functionality is intended only for training/demo use. Do not commit database credentials, Razorpay keys, uploaded documents, build outputs, or environment files.
