CREATE TABLE staff (
id uuid references auth.users on delete cascade not null PRIMARY KEY,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
department_id INTEGER NOT NULL REFERENCES departments(id),
created_at TIMESTAMP with time zone NOT NULL DEFAULT NOW(),
role_id INTEGER NOT NULL REFERENCES roles(id)
);

CREATE TABLE departments (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL UNIQUE,
coordinator_id uuid NOT NULL REFERENCES staff(id),
created_at TIMESTAMP with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL UNIQUE,
created_at TIMESTAMP with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE campaigns (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
closure_date timestamp with time zone NOT NULL,
final_closure_date timestamp with time zone NOT NULL,
created_at TIMESTAMP with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE ideas (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
author_id uuid NOT NULL REFERENCES staff(id),
category_id INTEGER NOT NULL REFERENCES categories(id),
is_anonymous BOOLEAN DEFAULT FALSE,
campaign_id INTEGER NOT NULL REFERENCES campaigns(id),
created_at TIMESTAMP with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE idea_documents (
id SERIAL PRIMARY KEY,
idea_id INTEGER NOT NULL REFERENCES ideas(id),
url VARCHAR(255) NOT NULL,
created_at TIMESTAMP with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
id SERIAL PRIMARY KEY,
idea_id INTEGER NOT NULL REFERENCES ideas(id),
author_id uuid NOT NULL REFERENCES staff(id),
comment TEXT NOT NULL,
created_at TIMESTAMP with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE votes (
id SERIAL PRIMARY KEY,
idea_id INTEGER NOT NULL REFERENCES ideas(id),
voter_id uuid NOT NULL REFERENCES staff(id),
is_upvote BOOLEAN NOT NULL,
created_at TIMESTAMP with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL UNIQUE,
description TEXT,
created_at TIMESTAMP with time zone NOT NULL DEFAULT NOW()
);

create function public.handle_new_user()
returns trigger as $$
begin
insert into public.staff (id, first_name, last_name, email, department_id, role_id)
values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'email', new.raw_user_meta_data->>'department_id',new.raw_user_meta_data->>'role_id');
return new;
end;

$$
language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
$$
