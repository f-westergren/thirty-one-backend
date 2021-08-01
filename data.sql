DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  username text NOT NULL,
  password text NOT NULL
);

CREATE TABLE games (
  id text PRIMARY KEY,
  deck text NOT NULL,
  pile text NOT NULL,
  player1 text REFERENCES users(id) ON DELETE CASCADE,
  player2 text REFERENCES users(id) ON DELETE CASCADE,
  player3 text REFERENCES users(id) ON DELETE CASCADE,
  player4 text REFERENCES users(id) ON DELETE CASCADE,
  hands text NOT NULL
);

INSERT INTO users 
  (id, email, username, password)
VALUES
  ('NOPLAYER', 'noplayer@mail.com', 'empty', 'fogeddabutit'),
  ('AI', 'aiplayer@mail.com', 'ai', 'vvvvvvsmart'),
  ('GUEST', 'unregistered@gmail.com', 'human', 'notvvvvsmart'),
  ('folke', 'folke@gmail.com', 'Folke', 'vvvvsmart')