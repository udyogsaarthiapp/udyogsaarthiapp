-- MySQL schema for Udyog Saarthi (minimal)
-- Run these statements in your MySQL instance and set DATABASE_URL accordingly, for example:
-- export DATABASE_URL='mysql+pymysql://user:password@localhost:3306/udyog_saarthi'

CREATE DATABASE IF NOT EXISTS udyog_saarthi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE udyog_saarthi;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  applied_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(300) NOT NULL,
  company VARCHAR(200),
  description TEXT,
  type VARCHAR(50) DEFAULT 'job',
  apply_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  job_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
