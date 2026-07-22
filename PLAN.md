# Comprehensive Fix & Enhancement Plan

## Issues Identified & Analysis

### A. Prisma Schema Type Mismatch
- **File**: `prisma/schema.prisma`
- **Problem**: Answer model uses `String` for `testAttemptId` and `questionId`, but `TestAttempt.id` is `Int` and `Question.id` is `Int`. This will cause runtime errors.
- **Fix**: Change `testAttemptId String` → `testAttemptId Int` and `questionId String` → `questionId Int`

### B. QuestionSet POST API Doesn't Create
- **File**: `src/app/api/question-sets/route.js`
- **Problem**: POST handler just returns existing sets instead of creating a new one
- **Fix**: Implement actual creation logic with title, description, timeLimit

### C. Missing Admin Pages (6 pages)
All these are empty files that need full implementation:
1. **Admin Login Page** (`/admin/login`) - Separate login for admin
2. **Admin Students List** (`/admin/students`) - View all students
3. **Admin Create Student** (`/admin/students/create`) - Form to create student
4. **Admin Question Sets** (`/admin/question-set`) - CRUD for question sets
5. **Admin Questions** (`/admin/question`) - CRUD for questions within sets
6. **Admin Results** (`/admin/results`) - View all test results

### D. Missing Certificate Page
- **File**: `src/app/certificate/[id]/page.js` - Empty
- **Fix**: Build certificate page that shows printable certificate for passed tests

### E. Results Page Bug
- **File**: `src/app/results/[id]/page.js`
- **Problem**: Line references `attempt.id` (undefined) instead of `testAttempt.id`
- **Fix**: Change variable reference

### F. Admin Dashboard Issues
- **File**: `src/app/admin/dashboard/page.js`
- **Problems**:
  - Logout button has no onClick handler
  - Missing "Results" link card
  - Links to wrong paths (`/admin/question-sets` should be `/admin/question-set`, `/admin/questions` should be `/admin/question`)

### G. Middleware - Admin Routes Not Protected
- **File**: `src/middleware.js`
- **Problem**: Admin routes need to be checked for ADMIN role, not just authentication

## Implementation Order

### Phase 1: Schema & Backend Fixes
1. Fix Prisma schema (type mismatch)
2. Fix QuestionSet POST API
3. Add admin auth check middleware logic
4. Create admin API endpoints (question-set CRUD, question CRUD, results, students list)

### Phase 2: Admin Pages
5. Build Admin Login page
6. Fix Admin Dashboard (logout, results link, route fixes)
7. Build Admin Students List page
8. Build Admin Create Student page
9. Build Admin Question Sets page
10. Build Admin Questions page
11. Build Admin Results page

### Phase 3: Student-Side Fixes & Certificate
12. Build Certificate page
13. Fix Results page bug (attempt.id → testAttempt.id)
14. Run build and verify

## API Routes Needed

### Admin APIs to Create:
1. `GET /api/admin/students` - List all students
2. `DELETE /api/admin/students/[id]` - Delete a student
3. `POST /api/admin/question-sets` - Create question set
4. `GET /api/admin/question-sets` - List all question sets (with question counts)
5. `PUT /api/admin/question-sets/[id]` - Update question set
6. `DELETE /api/admin/question-sets/[id]` - Delete question set
7. `GET /api/admin/question-sets/[id]/questions` - Get questions for a set
8. `POST /api/admin/questions` - Create a question
9. `PUT /api/admin/questions/[id]` - Update a question
10. `DELETE /api/admin/questions/[id]` - Delete a question
11. `GET /api/admin/results` - Get all test attempts/results

