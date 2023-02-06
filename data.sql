CREATE DATABASE movie;

CREATE TABLE IF NOT EXISTS movies(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	description TEXT NOT NULL,
	duration INTEGER NOT NULL,
	price INTEGER NOT NULL
);