CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('customer','admin'))
);
CREATE TABLE IF NOT EXISTS paintings (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, artist TEXT NOT NULL, description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0), image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','sold'))
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), painting_id TEXT NOT NULL REFERENCES paintings(id),
  status TEXT NOT NULL CHECK (status IN ('placed','cancelled')), created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), service_date DATE NOT NULL,
  size_sq_ft INTEGER NOT NULL CHECK (size_sq_ft BETWEEN 10 AND 500), address TEXT NOT NULL,
  wall_design_id TEXT NOT NULL DEFAULT 'madhubani-garden', wall_design_name TEXT NOT NULL DEFAULT 'Madhubani Garden',
  price INTEGER NOT NULL, status TEXT NOT NULL CHECK (status IN ('requested','confirmed','declined','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS wall_design_id TEXT NOT NULL DEFAULT 'madhubani-garden';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS wall_design_name TEXT NOT NULL DEFAULT 'Madhubani Garden';
CREATE UNIQUE INDEX IF NOT EXISTS bookings_one_active_date ON bookings(service_date) WHERE status IN ('requested','confirmed');
CREATE TABLE IF NOT EXISTS pottery_requests (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), item_id TEXT NOT NULL, item_name TEXT NOT NULL,
  glaze_id TEXT NOT NULL, glaze_name TEXT NOT NULL, quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 12),
  needed_by DATE NOT NULL, address TEXT NOT NULL DEFAULT '', status TEXT NOT NULL CHECK (status IN ('requested','accepted','declined','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pottery_requests ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value JSONB NOT NULL);
