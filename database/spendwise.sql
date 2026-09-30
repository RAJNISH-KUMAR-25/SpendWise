CREATE DATABASE IF NOT EXISTS spendwise
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE spendwise;

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(120) NOT NULL,
    description VARCHAR(500) NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category VARCHAR(30) NOT NULL,
    expense_date DATE NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_expense_category (category),
    INDEX idx_expense_date (expense_date),
    CONSTRAINT chk_expense_amount_positive CHECK (amount > 0)
) ENGINE=InnoDB;

INSERT INTO expenses (title, description, amount, category, expense_date, created_at, updated_at)
SELECT * FROM (
    SELECT 'Lunch' AS title, 'Lunch at a local restaurant' AS description, 250.00 AS amount, 'FOOD' AS category, '2026-09-29' AS expense_date, NOW() AS created_at, NOW() AS updated_at
    UNION ALL SELECT 'Uber Ride', 'Ride to office', 320.00, 'TRAVEL', '2026-09-28', NOW(), NOW()
    UNION ALL SELECT 'Electricity Bill', 'Monthly electricity payment', 1850.00, 'BILLS', '2026-09-27', NOW(), NOW()
    UNION ALL SELECT 'Movie', 'Weekend cinema ticket', 450.00, 'ENTERTAINMENT', '2026-09-26', NOW(), NOW()
    UNION ALL SELECT 'Grocery Shopping', 'Weekly groceries', 2140.50, 'FOOD', '2026-09-25', NOW(), NOW()
    UNION ALL SELECT 'Online Course', 'Java and Spring Boot course', 1299.00, 'EDUCATION', '2026-09-23', NOW(), NOW()
    UNION ALL SELECT 'Doctor Visit', 'Routine consultation', 800.00, 'HEALTH', '2026-09-21', NOW(), NOW()
    UNION ALL SELECT 'Backpack', 'New work backpack', 1750.00, 'SHOPPING', '2026-09-20', NOW(), NOW()
) AS sample_data
WHERE NOT EXISTS (SELECT 1 FROM expenses);

