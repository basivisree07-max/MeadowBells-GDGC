# Meadowbell implementation notes

## Login and roles

Customer sign-up is open. Studio accounts are added through the private seed file only. Passwords are hashed with bcrypt. The API signs a short-lived, HTTP-only, same-site session cookie and checks the account role on protected routes. Customers can only query and change their own orders, bookings, and pottery requests; admin routes return 403 for the wrong role. Record lookups with customer ownership are scoped in SQL and return not found when they do not belong to the signed-in customer.

## Database choice

PostgreSQL stores accounts, one-of-a-kind paintings, orders, bookings, pottery requests, and catalogue settings. It gives this small app transactional updates and database-enforced constraints without needing a separate ORM layer.

## Preventing duplicate sales and dates

Buying a painting runs a conditional `UPDATE ... WHERE status='available'` and inserts the order in the same transaction. Only one request can update the painting; concurrent buyers that lose receive a conflict response. Active wall bookings are protected by a partial unique index on service date for requested and confirmed rows. Cancellation makes the date available again, and the API handles a unique conflict with a clear message.

## Finished, left out, next

Finished: the original landing page remains unchanged; the new app includes sign-in and customer sign-up, the painting gallery and detail modal, customer order and booking views, pottery requests, an admin dashboard, a PostgreSQL API, password hashing, session roles, server validation, seed loading, responsive layouts, reduced-motion support, and synthesized sound effects.

Still limited: the provided pottery request can be created and cancelled while requested, but editing its fields is not yet exposed. The booking picker lists only unbooked dates in the allowed range, and the server atomically rejects dates that another customer takes. The purchase interaction shows a small floating-petals burst. A production launch should add HTTPS and set `NODE_ENV=production` so cookies use the Secure flag.

Next: add a compact calendar view and deploy the API with managed PostgreSQL and HTTPS.
