CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  qa_coordinator_email VARCHAR(255) NOT NULL
);

CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  agreed_to_terms_and_conditions BOOLEAN NOT NULL DEFAULT false,
  is_admin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_deletable BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES staff(id),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  closure_date DATE,
  final_closure_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE idea_documents (
  id SERIAL PRIMARY KEY,
  idea_id INTEGER NOT NULL REFERENCES ideas(id),
  document_url VARCHAR(255) NOT NULL
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  idea_id INTEGER NOT NULL REFERENCES ideas(id),
  author_id INTEGER NOT NULL REFERENCES staff(id),
  text TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE thumbs (
  id SERIAL PRIMARY KEY,
  idea_id INTEGER NOT NULL REFERENCES ideas(id),
  voter_id INTEGER NOT NULL REFERENCES staff(id),
  is_positive BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
