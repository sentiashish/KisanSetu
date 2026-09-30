CREATE TABLE IF NOT EXISTS farmers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_farmers_phone (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS workers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  farmer_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_workers_phone (phone_number),
  KEY idx_workers_farmer_id (farmer_id),
  CONSTRAINT fk_workers_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS labour_requests (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  farmer_id INT UNSIGNED NOT NULL,
  worker_id INT UNSIGNED NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'accepted', 'declined', 'stopped') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_labour_requests_farmer (farmer_id),
  KEY idx_labour_requests_worker (worker_id),
  CONSTRAINT fk_labour_requests_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_labour_requests_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS labour_replies (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  request_id INT UNSIGNED NOT NULL,
  worker_id INT UNSIGNED NOT NULL,
  reply_text VARCHAR(20) NOT NULL,
  replied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_labour_replies_request (request_id),
  KEY idx_labour_replies_worker (worker_id),
  UNIQUE KEY uq_labour_replies_request_worker (request_id, worker_id),
  CONSTRAINT fk_labour_replies_request FOREIGN KEY (request_id) REFERENCES labour_requests(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_labour_replies_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
