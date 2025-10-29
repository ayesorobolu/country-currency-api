CREATE DATABASE IF NOT EXISTS currency_api;
USE currency_api;

CREATE TABLE IF NOT EXISTS countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ci VARCHAR(255) NOT NULL,
  capital VARCHAR(255) NULL,
  region VARCHAR(255) NULL,
  population BIGINT NOT NULL,
  currency_code VARCHAR(16) NULL,
  exchange_rate DECIMAL(18,6) NULL,
  estimated_gdp DECIMAL(24,2) NULL,
  flag_url VARCHAR(512) NULL,
  last_refreshed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_countries_name_ci (name_ci)
);

CREATE TABLE IF NOT EXISTS app_meta (
  k VARCHAR(64) PRIMARY KEY,
  v TEXT NOT NULL
);