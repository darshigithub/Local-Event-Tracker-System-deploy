CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
 
    title VARCHAR(200) NOT NULL,
    description TEXT,
 
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
 
    capacity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
 
    latitude DECIMAL(9,6) NOT NULL, 
    longitude DECIMAL(9,6) NOT NULL, 
    address TEXT,
 
    category VARCHAR(50),
 
    status VARCHAR(20)
        CHECK (status IN ('active', 'cancelled', 'completed'))
        DEFAULT 'active',
 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);