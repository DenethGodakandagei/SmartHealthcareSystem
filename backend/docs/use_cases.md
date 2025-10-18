# Smart Healthcare System — Use Case Mapping

This document maps the provided use case scenarios to the existing backend structure and proposes concrete API endpoints, request/response shapes, validation rules, edge cases, and minimal test outlines. The goal: keep the current folder/file structure and reference existing files (controllers, services, models, routes) for implementation.

---

## Repository files referenced
- `src/controllers/auth.controller.ts`
- `src/controllers/patient.controller.ts`
- `src/controllers/record.controller.ts`
- `src/services/auth.service.ts`
- `src/services/patient.service.ts`
- `src/services/record.service.ts`
- `src/models/patient.model.ts`
- `src/models/record.model.ts`
- `src/models/user.model.ts`
- `src/routes/patient.route.ts`
- `src/routes/record.routes.ts`
- `src/routes/auth.routes.ts`
- `src/middleware/auth.middleware.ts`
- `src/utils/validation.util.ts`
- `src/utils/token.util.ts`

Note: This document only references and proposes; it does not change existing files.

---

## High-level contract
- Inputs: authenticated requests from doctors, patients, and staff; JSON payloads in request bodies; URL params and query params.
- Outputs: JSON responses with a consistent envelope: { success: boolean, data?: any, error?: string }
- Error modes: validation errors (400), auth errors (401/403), not found (404), conflict (409), server errors (500).
- Success criteria: endpoints return appropriate HTTP status codes, persist changes via the existing models/services, and trigger notifications where required (notifications are described as a follow-up).

---

## Use Case 1 — Manage Patient Records (Doctor updates patient records)

Primary actor: Doctor
Related controllers/services/models: `record.controller.ts`, `record.service.ts`, `patient.model.ts`, `record.model.ts`, `auth.middleware.ts`

Suggested endpoints:
- GET /api/patients?search=...&page=... — list/search patients (already tied to `patient.controller`)
  - Permissions: doctor, staff
  - Response: paged list of patients (id, name, dob, lastVisit, summary)
- GET /api/patients/:patientId/records — fetch patient records
  - Permissions: doctor, patient (self), staff
  - Response: { treatments: [ ... ], prescriptions: [ ... ], history: [ ... ] }
- PATCH /api/patients/:patientId/records/treatment/:treatmentId — update a specific treatment entry
  - Permissions: doctor
  - Request body: { diagnosis?: string, notes?: string, procedures?: string[], status?: "ongoing"|"completed", date?: ISOString }
  - Response: updated treatment object
- POST /api/patients/:patientId/records/treatment — create new treatment entry
  - Permissions: doctor
  - Request body: { diagnosis: string, notes?: string, procedures?: string[], startDate?: ISOString }
- POST /api/patients/:patientId/records/prescription — add or update prescription
  - Permissions: doctor
  - Request body: { medicationName: string, dosage: string, frequency: string, durationDays?: number, notes?: string }
  - Response: saved prescription

Validation rules (use `validation.util.ts` patterns):
- medicationName: non-empty string, max length 200
- dosage: non-empty string (validate pattern like "10 mg" or numeric + unit)
- frequency: enumerated common values or free text but max length 100
- durationDays: positive integer, reasonable upper bound (e.g., <= 365)
- For treatment updates: diagnosis required for new treatments; notes optional but limited length

Drug interaction and dosage checks (business validation):
- Implement in `record.service.ts` or a new `pharmacy.util.ts` called by the service.
- Basic checks to suggest warnings (not required to block save on first pass). Store warnings in record metadata.

Security and authorization:
- Use `auth.middleware.ts` to ensure doctor role. If roles exist on `user.model.ts`, gate PATCH/POST operations to role === 'doctor' or 'staff' with proper privileges.

Edge cases:
- Patient or treatment ID not found => 404
- Concurrent updates => use optimistic locking (updatedAt / version) or lastWriteWins and return a 409 with latest data if conflict detected
- Invalid prescription data => 400 with field-level messages

Acceptance tests (happy + edge):
- /tests/record.test.ts
  - Doctor can add a prescription => returns 201 and prescription persisted
  - Doctor can update treatment => returns 200 and treatment fields updated
  - Non-doctor trying to update => 403
  - Invalid dosage format => 400 with validation message
  - Concurrent update results in 409 (if implemented)

---

## Use Case 2 — Patient Books an Appointment

Primary actor: Patient
Related files: there are no explicit `appointment` files in current structure. Suggested additions are minimal and can be placed under the same pattern:
- `src/models/appointment.model.ts` (new)
- `src/controllers/appointment.controller.ts` (new)
- `src/services/appointment.service.ts` (new)
- `src/routes/appointment.routes.ts` (new)

Suggested endpoints:
- GET /api/doctors — existing or extended `patient.controller` can provide doctors list or create a dedicated `doctor` endpoint
- GET /api/doctors/:doctorId/availability?date=YYYY-MM-DD — returns available slots
- POST /api/appointments — book an appointment
  - Request body: { doctorId: string, patientId?: string (if authenticated and omitted, take from token), startTime: ISOString, durationMinutes?: number, reason?: string }
  - Response: { appointmentId: string, reference: string, status: 'pending' | 'confirmed' }
- GET /api/appointments/:appointmentId — fetch appointment
- DELETE /api/appointments/:appointmentId — cancel before confirmation

Validation/business rules:
- Verify doctor availability in `appointment.service` atomically when creating appointment. Use DB transactions where possible.
- Limit overlapping bookings for same patient or double-booking same doctor slot.
- Generate booking reference (e.g., APPT-YYYYMMDD-<shortid>) and return to user.

Edge cases:
- Slot not available -> 409 with alternative suggestions (next available slots or other doctors)
- Session invalid -> 401
- Network/DB failure during booking -> 500 and do not create partial records (transaction required)

Tests:
- /tests/appointment.test.ts (new)
  - Successful booking returns 201 with appointment and reference
  - Booking unavailable slot returns 409 and suggested alternatives
  - Cancelling a pending booking removes or marks cancelled

Notes about minimal implementation without heavy changes:
- If you want to avoid new DB table initially, you can store appointment-like objects in an existing collection (not recommended). Better to add `appointment.model.ts`.

---

## Use Case 3 — Confirm Appointment (Staff confirms pending appointment)

Primary actor: Staff
Related files: `appointment.*` (as above) and `auth.middleware.ts`

Suggested endpoints:
- GET /api/appointments?status=pending — list pending appointments (staff only)
- PATCH /api/appointments/:appointmentId/confirm — staff confirms the appointment
  - Request body: { confirmedBy: staffId, confirmTime?: ISOString }
  - Behavior: change status to 'confirmed', notify patient and doctor

Notifications:
- Implement an interface in `services/notification.service.ts` (new) with methods: notifyEmail(userId, template, payload), notifySMS(...), notifyInApp(...)
- For this milestone, make notification calls optional / mocked, but include hooks in `appointment.service` to call notification service when status changes.

Edge cases:
- Doctor not available at confirmation time -> 409 or reschedule flow
- Missing patient details -> 400

Tests:
- /tests/appointment.test.ts
  - Staff can confirm pending appointment -> returns 200 and status updated
  - If doctor not available -> 409 and staff can suggest reschedule

---

## Use Case 4 — Generate Reports

Primary actor: Healthcare Manager
Related files: there is no explicit reporting module. We can add lightweight reporting endpoints that aggregate existing models:
- `src/controllers/report.controller.ts` (new)
- `src/services/report.service.ts` (new)

Suggested endpoints:
- GET /api/reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD&type=admissions|appointments|utilization|staff-workload
  - Permissions: manager
  - Response: aggregated metrics, counts, and time-series arrays
- GET /api/reports/export?format=csv|pdf&... — returns downloadable file (optional)

Implementation notes:
- Use existing models: `patient.model`, `record.model`, `appointment.model` to aggregate.
- Keep queries efficient: add indexes for common filters (createdAt, doctorId, department)
- For heavy reports, implement background jobs and cached results; expose `GET /api/reports/:jobId` for scheduled reports.

Edge cases:
- No data for range -> HTTP 204 or 200 with empty dataset and message
- Invalid date range -> 400

Tests:
- /tests/report.test.ts (new)
  - Request for a valid range returns 200 with metrics
  - Invalid params return 400

---

## Data Shapes (recommended minimal schemas)

Patient (existing `patient.model` should already include many fields):
- id: string
- name: string
- dob: string (ISO)
- contact: { phone?: string, email?: string }
- history: array of notes/refs

Treatment entry (embedded in record or separate collection):
- id: string
- patientId: string
- doctorId: string
- diagnosis: string
- notes?: string
- procedures?: string[]
- status: 'ongoing'|'completed'
- createdAt, updatedAt

Prescription entry:
- id: string
- patientId: string
- doctorId: string
- medicationName: string
- dosage: string
- frequency: string
- durationDays?: number
- warnings?: string[]
- createdAt, updatedAt

Appointment:
- id: string
- reference: string
- patientId: string
- doctorId: string
- startTime: ISOString
- durationMinutes: number
- status: 'pending'|'confirmed'|'cancelled'|'completed'
- createdAt, updatedAt

---

## Validation checklist (fields and constraints)
- Required fields present for create endpoints
- String lengths capped (names 200, notes 2000)
- Dates are valid ISO strings and logical (start <= end)
- Numbers positive and bounded (durationMinutes <= 24*60)
- Role-based access control enforced via `auth.middleware`

Use `src/utils/validation.util.ts` to centralize validators.

---

## Suggested Tests (files & brief contents)
- `tests/record.test.ts` (exists) — expand with doctor update/create prescriptions and treatments
- `tests/auth.test.ts` (exists) — ensure token-based role checks
- `tests/appointment.test.ts` (new) — booking, conflict, cancellation
- `tests/report.test.ts` (new) — report generation happy path and no-data edge

Write tests using existing test patterns in the repo (refer to `backend/tests/*.ts`) and mock DB operations when possible.

---

## Implementation priorities and small, low-risk extras
1. Implement appointment model + routes + service (minimal fields) — necessary for use cases 2 & 3.
2. Expand `record.service` to add prescription validations and hook for basic drug-interaction warnings (store as metadata). Add tests.
3. Add report service with a simple summary endpoint that queries counts — low risk.
4. Add notification service interface (mock implementation) and call it from appointment confirmation.

Low-risk extras implemented during coding:
- Add request/response envelope helper
- Add consistent error formatting middleware (reuse `src/middleware/errorHandler.ts`)

---

## Next steps (concrete)
- Decide if `appointments` should be a new DB collection/table. Recommended: yes.
- Create minimal `appointment.model.ts`, `appointment.service.ts`, `appointment.controller.ts`, and `appointment.routes.ts` following repo conventions.
- Extend `record.service.ts` to validate prescriptions and save warnings.
- Add tests under `backend/tests` for appointment and expanded record flows.

---

## Contact and notes
If you'd like, I can:
- scaffold the minimal appointment files in `src/models`, `src/controllers`, `src/services`, and `src/routes` (one small PR), and add unit tests.
- implement prescription validation and a basic notification hook.

Tell me which part to implement next and I'll proceed (I will make edits under the existing folder and file names and keep changes minimal and test-backed).
