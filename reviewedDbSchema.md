CREATE TABLE staff (
staff_id SERIAL PRIMARY KEY,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
department_id INTEGER NOT NULL REFERENCES departments(department_id),
is_admin BOOLEAN DEFAULT FALSE,
agreed_to_terms BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
role_id INTEGER NOT NULL REFERENCES roles(role_id), -- add reference to new table
);

CREATE TABLE departments (
department_id SERIAL PRIMARY KEY,
department_name VARCHAR(255) NOT NULL,
coordinator_id INTEGER NOT NULL REFERENCES staff(staff_id),
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
category_id SERIAL PRIMARY KEY,
category_name VARCHAR(255) NOT NULL UNIQUE,
is_deletable BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ideas (
idea_id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
author_id INTEGER NOT NULL REFERENCES staff(staff_id),
category_id INTEGER NOT NULL REFERENCES categories(category_id),
is_enabled BOOLEAN DEFAULT TRUE,
is_anonymous BOOLEAN DEFAULT FALSE,
closure_date DATE NOT NULL,
final_closure_date DATE NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE idea_documents (
document_id SERIAL PRIMARY KEY,
idea_id INTEGER NOT NULL REFERENCES ideas(idea_id),
filename VARCHAR(255) NOT NULL,
filedata BYTEA NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
comment_id SERIAL PRIMARY KEY,
idea_id INTEGER NOT NULL REFERENCES ideas(idea_id),
author_id INTEGER NOT NULL REFERENCES staff(staff_id),
comment TEXT NOT NULL,
is_anonymous BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE votes (
vote_id SERIAL PRIMARY KEY,
idea_id INTEGER NOT NULL REFERENCES ideas(idea_id),
voter_id INTEGER NOT NULL REFERENCES staff(staff_id),
is_upvote BOOLEAN NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE roles (
role_id SERIAL PRIMARY KEY,
role_name VARCHAR(255) NOT NULL UNIQUE,
description TEXT,
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);