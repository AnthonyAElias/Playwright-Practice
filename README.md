# Playwright Practice Lab

A small local website built for practicing Playwright locators, form actions, navigation, assertions, and local storage state.

## Run locally

```bash
node server.mjs
```

Then open:

```text
http://localhost:4173
```

## Demo login

- Email: `demo@example.com`
- Password: `playwright`

## Useful selectors

- `data-testid="login-page"`
- `data-testid="email-input"`
- `data-testid="password-input"`
- `data-testid="login-button"`
- `data-testid="home-page"`
- `data-testid="nav-intake"`
- `data-testid="intake-form"`
- `data-testid="first-name-input"`
- `data-testid="last-name-input"`
- `data-testid="intake-email-input"`
- `data-testid="ssn-input"`
- `data-testid="address-input"`
- `data-testid="anticipated-start-date-input"`
- `data-testid="applicant-type-select"`
- `data-testid="skip-applicant-intake-yes"`
- `data-testid="psl-select"`
- `data-testid="submit-intake-button"`
- `data-testid="person-records-body"`
- `data-testid="person-detail-panel"`
- `data-testid="workflow-status-banner"`
- `data-testid="workflow-status-value"`
- `data-testid="approve-person-button"`
- `data-testid="disapprove-person-button"`
- `data-testid="detail-first-name"`
- `data-testid="detail-ssn"`
- `data-testid="detail-anticipated-start-date"`
- `data-testid="detail-applicant-type"`
- `data-testid="back-to-intake-button"`
- `data-testid="nav-tasks"`
- `data-testid="task-search"`
- `data-testid="save-settings-button"`
- `data-testid="toast"`

## Practice ideas

- Assert the login button starts disabled.
- Submit invalid credentials and expect the alert.
- Log in successfully and assert the home heading.
- Navigate to Intake, submit a Person record, and assert the table row appears.
- Click a Person record row and assert the read-only detail view and workflow status.
- Submit Intake with `Skip Applicant Intake` set to `Yes` and assert the workflow status is `Record Checks`.
- Submit Intake with an SSN and assert only the masked value is shown, such as `XXX-XX-5555`.
- Click Approve on a Person detail page and assert the workflow status updates to `Intake Review`.
- Click Disapprove on a Person detail page and assert the workflow status updates to `Inactive`.
- Click Refresh data and expect counters plus a toast.
- Navigate to Tasks, search for a missing task, and assert the empty state.
- Complete a task and assert the card receives the `done` class.
- Update Settings and assert the profile name changes.
- Log out and assert the login page returns.
