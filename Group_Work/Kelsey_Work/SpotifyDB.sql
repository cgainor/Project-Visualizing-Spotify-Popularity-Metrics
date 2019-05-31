CREATE DATABASE spotify_db;

USE spotify_db;

CREATE TABLE spotifyTop2018 (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
    
    
LOAD DATA INFILE 'C:\ProgramData\MySQL\MySQL Server 8.0\Uploads' 
INTO TABLE spotifyTop2018 
FIELDS TERMINATED BY ',';

SHOW VARIABLES LIKE "secure_file_priv";