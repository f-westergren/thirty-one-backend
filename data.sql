DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id integer PRIMARY KEY,
  email text NOT NULL UNIQUE,
  username text NOT NULL,
  password text NOT NULL
);

CREATE TABLE games (
  id text PRIMARY KEY,
  deck text NOT NULL,
  pile text NOT NULL,
  player1 integer REFERENCES users(id) ON DELETE CASCADE,
  player2 integer REFERENCES users(id) ON DELETE CASCADE,
  player3 integer REFERENCES users(id) ON DELETE CASCADE,
  player4 integer REFERENCES users(id) ON DELETE CASCADE,
  hands text NOT NULL
);

INSERT INTO users 
  (id, email, username, password)
VALUES
  (0, 'noplayer@mail.com', 'empty', 'fogeddabutit'),
  (1, 'aiplayer@mail.com', 'ai', 'vvvvvvsmart'),
  (2, 'unregistered@gmail.com', 'human', 'notvvvvsmart'),
  (3, 'folke@gmail.com', 'Folke', 'vvvvsmart')