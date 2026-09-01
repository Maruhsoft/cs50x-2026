-- CS50 Duck theft investigation
-- July 28, 2025 — Humphrey Street Bakery

-- 1. Crime scene
SELECT *
FROM crime_scene_reports
WHERE year = 2025
  AND month = 7
  AND day = 28
  AND street = 'Humphrey Street';

-- 2. Witness interviews
SELECT id, name, transcript
FROM interviews
WHERE year = 2025
  AND month = 7
  AND day = 28
ORDER BY id;

-- 3. Cars leaving the bakery within 10 minutes of the theft
SELECT *
FROM bakery_security_logs
WHERE year = 2025
  AND month = 7
  AND day = 28
  AND activity = 'exit'
  AND hour = 10
  AND minute BETWEEN 15 AND 25
ORDER BY hour, minute;

-- 4. People whose cars were among those candidates and
--    who withdrew money from the Leggett Street ATM
SELECT DISTINCT
    p.id,
    p.name,
    p.license_plate,
    a.account_number,
    a.amount
FROM atm_transactions a
JOIN bank_accounts b
    ON a.account_number = b.account_number
JOIN people p
    ON b.person_id = p.id
WHERE a.year = 2025
  AND a.month = 7
  AND a.day = 28
  AND a.atm_location = 'Leggett Street'
  AND a.transaction_type = 'withdraw'
  AND p.license_plate IN (
      SELECT license_plate
      FROM bakery_security_logs
      WHERE year = 2025
        AND month = 7
        AND day = 28
        AND activity = 'exit'
        AND hour = 10
        AND minute BETWEEN 15 AND 25
  );

-- 5. Short calls made by the remaining suspects
SELECT
    caller.name AS caller_name,
    receiver.name AS receiver_name,
    pc.duration
FROM phone_calls pc
JOIN people caller
    ON pc.caller = caller.phone_number
JOIN people receiver
    ON pc.receiver = receiver.phone_number
WHERE pc.year = 2025
  AND pc.month = 7
  AND pc.day = 28
  AND pc.duration < 60
  AND caller.name IN ('Bruce', 'Diana');

-- 6. Earliest flight from Fiftyville on July 29, 2025
SELECT
    f.id AS flight_id,
    printf('%02d:%02d', f.hour, f.minute) AS departure,
    origin.city AS origin,
    destination.city AS destination
FROM flights f
JOIN airports origin
    ON f.origin_airport_id = origin.id
JOIN airports destination
    ON f.destination_airport_id = destination.id
WHERE f.year = 2025
  AND f.month = 7
  AND f.day = 29
  AND origin.city = 'Fiftyville'
ORDER BY f.hour, f.minute
LIMIT 1;

-- 7. Passengers on the earliest flight
SELECT
    p.id,
    p.name,
    p.passport_number,
    passengers.seat
FROM passengers
JOIN people p
    ON passengers.passport_number = p.passport_number
WHERE passengers.flight_id = (
    SELECT f.id
    FROM flights f
    JOIN airports a
        ON f.origin_airport_id = a.id
    WHERE f.year = 2025
      AND f.month = 7
      AND f.day = 29
      AND a.city = 'Fiftyville'
    ORDER BY f.hour, f.minute
    LIMIT 1
);

-- 8. Final verification of Bruce's short call
SELECT
    caller.name AS caller,
    receiver.name AS receiver,
    phone_calls.duration
FROM phone_calls
JOIN people caller
    ON phone_calls.caller = caller.phone_number
JOIN people receiver
    ON phone_calls.receiver = receiver.phone_number
WHERE caller.name = 'Bruce'
  AND phone_calls.year = 2025
  AND phone_calls.month = 7
  AND phone_calls.day = 28
  AND phone_calls.duration < 60;
