# TASK: Build the remaining screens for "Meadowbell" (art studio website)

I have already built the landing/front page (screenshot + code attached). It is
the visual source of truth. DO NOT modify the landing page's theme, fonts,
colors, layout, copy, or button styles in any way. Treat those files as
read-only. Extract the design tokens from them (font families, color palette,
border radius, shadows, button styles) and reuse them everywhere.

## 1. Visual theme (must match the landing page)

- Landing page style: a Ghibli-like painted scene, with a blue sky, big white
  clouds and a green grassy hill. The logo is "Meadowbell" with a sprout icon.
  The headline uses a chunky rounded display font in uppercase. Body text is a
  clean sans-serif. Buttons are white or frosted-green pill buttons with a
  green text color.
- Reuse the SAME fonts, the SAME green/white/sky-blue palette, and the SAME
  pill buttons across every new screen.
- Use the same grass-and-sky background image on ALL new screens (full-bleed,
  fixed or parallax). Put content on frosted-glass / soft white cards
  (backdrop-blur, rounded-2xl, soft shadow) so text stays readable over the
  background. Add a subtle dark/light overlay if needed for contrast.
- Keep the same header: sprout logo "Meadowbell" on the left, and on the right a
  pill button (Login before sign-in, and Profile/Logout after sign-in).
- Simple UI is fine, but it must look cohesive with the landing page.

## 2. Product context

A small, reliable full-stack website for an art studio with two roles:
customer and admin (studio). The studio does three things:

### A. Sells paintings
- Each painting is one of a kind, so it can be bought only once.
- Admin adds and edits paintings (editing is allowed only while the painting
  is still available).
- A customer buys an available painting, which creates an order with status
  `placed`.
- A customer can cancel their order (status `cancelled`) and the painting
  becomes available again.
- No real payments. Buying only creates an order.

### B. Paints walls, on booking
- A customer picks a date between 7 and 90 days from today, enters the wall
  size (10 to 500 sq ft) and the address.
- Each date can be booked only once.
- Admin confirms or declines the booking.
- A customer can cancel until 3 days before the date.
- Price = wall size x rate (rate comes from the seed data).
- Booking statuses: `requested`, `confirmed`, `declined`, `cancelled`.

### C. Makes custom pottery, on request
- A customer chooses an item and a glaze (from seed data), a quantity (1 to 12)
  and a needed-by date at least 14 days away.
- Admin accepts or declines the request.
- A customer can edit or cancel a request only while it is `requested`.
- Pottery statuses: `requested`, `accepted`, `declined`, `cancelled`.

## 3. RBAC (enforce on the SERVER for every request)

| Action                                                  | Customer              | Admin |
|---------------------------------------------------------|-----------------------|-------|
| Browse paintings                                        | Yes                   | Yes   |
| Add/edit a painting (only while available)              | No                    | Yes   |
| Buy a painting, book a wall date, request pottery       | Yes                   | No    |
| See orders, bookings, pottery requests                  | Only their own        | All   |
| Confirm/decline booking, accept/decline pottery request | No                    | Yes   |
| Cancel an order, booking or request                     | Yes (only their own)  | No    |

- Not logged in -> 401
- Wrong role -> 403
- A customer requesting someone else's record -> 404 (not found)

## 4. Screens to build (in this order)

1. **Login page** (Customer and Admin variants, reached from the landing page
   buttons "Login as Customer" / "Login as Admin"), plus a customer
   Sign-up page. No admin sign-up.
2. **Paintings gallery**: a grid of painting cards (image, title, artist/
   description, price, status badge Available / Sold). Include a search/filter.
3. **Painting detail popup/modal** (see the effects below) with a Buy button
   (customer) or an Edit button (admin, only if available).
4. **My Orders** (customer): list with a Cancel button, and a clear message if
   the painting was just sold or the order is already cancelled.
5. **Wall Painting Booking**: date picker (only the allowed 7 to 90 day range;
   disable already-booked dates), wall size input with a live price estimate,
   and an address field. Then "My Bookings" with cancellation (blocked inside
   the 3-day window, with a clear message).
6. **Custom Pottery Request**: item select, glaze select, quantity 1 to 12,
   needed-by date (min +14 days). Then "My Requests" with edit/cancel while
   `requested`.
7. **Admin Dashboard**: tabs for Paintings (add/edit), Orders (view all),
   Bookings (confirm/decline), Pottery Requests (accept/decline).
8. **Navigation**: a consistent top nav (Paintings, Wall Painting, Pottery,
   My Orders/Bookings/Requests, or the admin tabs) in the same pill style.

Every screen that loads data MUST show three states: a loading state
(skeleton or a gentle sprout/spinner), an empty state (friendly message and
illustration/icon) and an error state (clear message and a Retry button).
When the app refuses something (painting just sold, date just taken, cancel
window passed), show a clear toast or inline message.

## 5. Sound effects and animations (important)

Create a small audio manager (a single module, e.g. `sound.js`) that preloads
sounds and exposes `playSound(name)`. Add a mute/unmute toggle in the header
(remember the preference in localStorage). Respect browser autoplay rules, so
unlock audio on the first user click.

Sounds (use royalty-free files in /public/sounds, or generate them with the
Web Audio API if no files are available; tell me which you used):
- `login-success`: a soft, bright chime or a gentle wind-bell (matches the
  "Meadowbell" name) when login succeeds.
- `login-error`: a soft low "boop" when login fails.
- `click`: a tiny pop on button presses.
- `popup-open`: a gentle "whoosh/pop" when a painting modal opens.
- `popup-close`: a soft reverse-pop on close.
- `success`: a happy sparkle on a successful purchase, booking or request.
- `cancel`: a soft descending tone on cancellation.

Popup effects when a painting is clicked:
- The card smoothly zooms/expands from its position into a centered modal
  (shared-element style transition, or scale + fade with a spring ease).
- The background gets a soft blur and a dim overlay.
- The painting image gets a subtle hover tilt/parallax and zoom.
- Details (title, price, description, Buy/Edit button) fade and slide in
  with a small stagger.
- Closing works via X, the Esc key, or clicking outside, and plays the close
  animation and sound.
- A purchase triggers a small confetti / floating petals burst.
- Respect `prefers-reduced-motion` (reduce the animations).

Also add: a soft hover lift on cards, and a gentle fade/slide page transition.

## 6. Data

I will provide the seed dataset separately (painting images, titles, prices,
customers, admin account, wall rate, pottery items and glazes). Until then:
- Build a seed script that reads from a `/seed` folder (JSON or CSV) so I can
  drop my files in without changing code.
- Use clearly marked placeholder data in the same shape for now.
- Do not hardcode prices, rates, or credentials in the UI code.

## 7. Backend and correctness requirements

- Tech stack: use what you judge best, and tell me your choice and the reasons
  in DESIGN.md. Use a real database (Postgres or MongoDB preferred, cloud-hosted
  if possible).
- Prevent double-buying a painting and double-booking a date using
  ATOMIC operations (a unique constraint plus a transaction, or an atomic
  conditional update), not just a UI check. Return a clear error to the UI when
  someone loses the race.
- Server-side validation of ALL rules above (date ranges, wall size,
  quantity, the 3-day cancel window, the status transitions, ownership).
- Auth: hashed passwords (bcrypt/argon2), JWT or session cookies, and role
  checks in middleware on every route.
- Do not commit secrets. Provide `.env.example` with a placeholder for every
  variable.

## 8. Deliverables

- Clean, readable code with a clear folder structure, with short comments only
  where the logic is not obvious (I must be able to explain it live).
- `README.md`: exact steps to run on a clean machine (install, env, seed, run).
- `DESIGN.md` answering briefly:
  1. How do login and the two roles work?
  2. Which database did you choose, and why?
  3. How do you stop two people from taking the same painting or date?
  4. What did you finish, what did you leave out, and what would you do next?
- `.env.example`.

## 9. Hard rules (do not break)

- DO NOT change the landing page's theme, fonts, colors, layout, or text.
- Do not add real payments, image uploads, emails/SMS, password reset or social
  login.
- Prefer a small app that works over a large one that breaks. If something
  can't be finished, list it in DESIGN.md.

Work step by step: first confirm the design tokens you extracted from the
landing page, then build screens 1 to 8 in order, and give me a short summary
after each stage.