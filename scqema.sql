CREATE TABLE IF NOT EXISTS students(
    id  INTEGER PRIMARY KEY,
    email   TEXT UNIQUE NOT NULL,
    username    TEXT UNIQUE NOT NULL,
    password    TEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions(
    token   TEXT PRIMARY KEY,
    student_id  INTEGER NOT NULL REFERENCES students(id)
);


CREATE TABLE IF NOT EXISTS submissions(
    id  INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    title   TEXT NOT NULL,
    description     TEXT,
    filename    TEXT NOT NULL,
    original_name   TEXT NOT NULL,
    created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);