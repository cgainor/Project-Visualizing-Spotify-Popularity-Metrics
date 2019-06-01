# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import sqlalchemy
from sqlalchemy import create_engine
import json
import pandas as pd
import pymysql
pymysql.install_as_MySQLdb()

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

# Connect to Server
engine = sqlalchemy.create_engine('mysql+pymysql://root:Courtdata8*@127.0.0.1:3306')

# Drop db
engine.execute("DROP DATABASE IF EXISTS spotify_db")
# Create db
engine.execute("CREATE DATABASE spotify_db")
# Select new db
engine.execute("USE spotify_db")

# Create 'song' table
engine.execute('CREATE TABLE spotify_songs (\
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
   spotify_id VARCHAR (40),\
    `name` VARCHAR (80),\
   artists VARCHAR (40),\
   danceability FLOAT,\
   energy FLOAT,\
   `key` INT,\
   loudness FLOAT,\
   `mode` INT,\
   speechiness FLOAT,\
   acousticness FLOAT,\
   instrumentalness FLOAT,\
   liveness FLOAT,\
   valence FLOAT,\
   tempo FLOAT,\
   duration_ms FLOAT,\
   time_signature INT);')

# Open CSV using Pandas
spotify_csv = "resources/top2018.csv"
spotify_df = pd.read_csv(spotify_csv)
spotify_df = spotify_df.rename(columns={'id': "spotify_id"})

# Insert csv data into empty database
spotify_df.to_sql(name='spotify_songs', con=engine, if_exists='append', index=False)

# Create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
