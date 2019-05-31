create database spotify_db;
use spotify_db;

CREATE TABLE spotifyTop2018 (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    spotify_id VARCHAR (40),
	`name` VARCHAR (80),
    artists VARCHAR (40),
    danceability FLOAT,
    energy FLOAT,
    `key` INT,
    loudness FLOAT,
    `mode` INT,
    speechiness FLOAT,
    acousticness FLOAT,
    instrumentalness FLOAT,
    liveness FLOAT,
    valence FLOAT,
    tempo FLOAT,
    duration_ms FLOAT,
    time_signature INT);
    
    select * from spotifyTop2018
    