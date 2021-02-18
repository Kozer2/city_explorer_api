DROP TABLE IF EXISTS LocationTable;
CREATE TABLE IF NOT EXISTS LocationTable(
    Id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude NUMERIC(18,15),
    longitude NUMERIC(18, 15)
);

-- INSERT INTO LocationTable (search_query, formatted_query, latitude, longitude) VALUES ('seattle', 'Seattle, WA, USA', '47.606210', '-122.332071');

