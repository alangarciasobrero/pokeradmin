-- Orphan payments report
-- Lists payments whose user_id has no matching users row.
-- Run in MySQL Workbench: select database(); then execute.

SELECT p.user_id, COUNT(*) AS payments_count, SUM(p.amount) AS total_amount
FROM payments p
LEFT JOIN users u ON p.user_id = u.id
WHERE u.id IS NULL
GROUP BY p.user_id
ORDER BY payments_count DESC;
