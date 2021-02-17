CREATE TABLE IF NOT EXISTS LocationTable(
    Id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude NUMERIC(18,15),
    longitude NUMERIC(18, 15)
);