DROP
DATABASE IF EXISTS `smileTrack`;
CREATE
DATABASE `smileTrack`;
USE
`smileTrack`;



-- ============================================================
-- Dental Lab Case Tracking System
-- MariaDB DDL + Test Data
-- ============================================================

SET
FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- DROP TABLES
-- ============================================================
DROP TABLE IF EXISTS NOTIFICATION;
DROP TABLE IF EXISTS ALERT_READ_STATUS;
DROP TABLE IF EXISTS ALERT;
DROP TABLE IF EXISTS ISSUE;
DROP TABLE IF EXISTS CASE_NOTE;
DROP TABLE IF EXISTS SCAN_LOG;
DROP TABLE IF EXISTS CASE_PROCESS;
DROP TABLE IF EXISTS `CASE`;
DROP TABLE IF EXISTS EMPLOYEE_PROCESS_CAPABILITY;
DROP TABLE IF EXISTS DOCTOR;
DROP TABLE IF EXISTS CLINIC;
DROP TABLE IF EXISTS EMPLOYEE;
DROP TABLE IF EXISTS DEPARTMENT;
DROP TABLE IF EXISTS PRODUCT_WORKFLOW;
DROP TABLE IF EXISTS PROCESS;
DROP TABLE IF EXISTS PRODUCT_TYPE;
DROP TABLE IF EXISTS LOCATION;

SET
FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- LOCATION
-- ============================================================
CREATE TABLE LOCATION
(
    location_id        INT AUTO_INCREMENT PRIMARY KEY,
    location_name      VARCHAR(100) NOT NULL,
    location_code      VARCHAR(20)  NOT NULL UNIQUE,
    location_type      ENUM('room','area','shelf') NOT NULL,
    parent_location_id INT,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_location_id) REFERENCES LOCATION (location_id)
);

-- ============================================================
-- PRODUCT_TYPE
-- ============================================================
CREATE TABLE PRODUCT_TYPE
(
    product_type_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name    VARCHAR(100) NOT NULL,
    category        VARCHAR(50),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- PROCESS
-- ============================================================
CREATE TABLE PROCESS
(
    process_id          INT AUTO_INCREMENT PRIMARY KEY,
    process_name        VARCHAR(100) NOT NULL,
    process_code        VARCHAR(20)  NOT NULL UNIQUE,
    duration_hours      INT          NOT NULL DEFAULT 8,
    default_location_id INT,
    description         TEXT,
    created_at          TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (default_location_id) REFERENCES LOCATION (location_id)
);

-- ============================================================
-- PRODUCT_WORKFLOW
-- ============================================================
CREATE TABLE PRODUCT_WORKFLOW
(
    workflow_id     INT AUTO_INCREMENT PRIMARY KEY,
    product_type_id INT NOT NULL,
    process_id      INT NOT NULL,
    sequence_order  INT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_type_id) REFERENCES PRODUCT_TYPE (product_type_id),
    FOREIGN KEY (process_id) REFERENCES PROCESS (process_id)
);

-- ============================================================
-- DEPARTMENT (manager_id FK는 EMPLOYEE 생성 후 ALTER로 추가)
-- ============================================================
CREATE TABLE DEPARTMENT
(
    department_id       INT AUTO_INCREMENT PRIMARY KEY,
    department_name     VARCHAR(100) NOT NULL,
    default_location_id INT,
    manager_id          INT,
    is_active           BOOLEAN   DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (default_location_id) REFERENCES LOCATION (location_id)
);

-- ============================================================
-- EMPLOYEE
-- ============================================================
CREATE TABLE EMPLOYEE
(
    employee_id         INT AUTO_INCREMENT PRIMARY KEY,
    employee_name       VARCHAR(100) NOT NULL,
    department_id       INT,
    role                TEXT,
    default_location_id INT,
    shift_start         TIME         NOT NULL DEFAULT '09:00:00',
    shift_end           TIME         NOT NULL DEFAULT '18:00:00',
    is_manager          BOOLEAN               DEFAULT FALSE,
    is_active           BOOLEAN               DEFAULT TRUE,
    is_on_duty          BOOLEAN               DEFAULT FALSE,
    created_at          TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES DEPARTMENT (department_id),
    FOREIGN KEY (default_location_id) REFERENCES LOCATION (location_id)
);

-- EMPLOYEE 생성 후 DEPARTMENT의 manager_id FK 추가 (순환참조 해결)
ALTER TABLE DEPARTMENT
    ADD FOREIGN KEY (manager_id) REFERENCES EMPLOYEE (employee_id);

-- ============================================================
-- CLINIC
-- ============================================================
CREATE TABLE CLINIC
(
    clinic_id                   INT AUTO_INCREMENT PRIMARY KEY,
    clinic_name                 VARCHAR(200) NOT NULL,
    clinic_alias                VARCHAR(200),
    address                     TEXT,
    email                       VARCHAR(200),
    phone_number                VARCHAR(200),
    shipping_instruction        TEXT,
    assigned_account_manager_id INT,
    is_active                   BOOLEAN   DEFAULT TRUE,
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_account_manager_id) REFERENCES EMPLOYEE (employee_id)
);

-- ============================================================
-- DOCTOR
-- ============================================================
CREATE TABLE DOCTOR
(
    doctor_id    INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name  VARCHAR(100) NOT NULL,
    clinic_id    INT          NOT NULL,
    email        VARCHAR(200),
    phone_number VARCHAR(200),
    preferences  TEXT,
    is_active    BOOLEAN   DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clinic_id) REFERENCES CLINIC (clinic_id)
);

-- ============================================================
-- EMPLOYEE_PROCESS_CAPABILITY
-- ============================================================
CREATE TABLE EMPLOYEE_PROCESS_CAPABILITY
(
    capability_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id   INT NOT NULL,
    process_id    INT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE (employee_id),
    FOREIGN KEY (process_id) REFERENCES PROCESS (process_id)
);

-- ============================================================
-- CASE
-- ============================================================
CREATE TABLE `CASE`
(
    case_id             INT AUTO_INCREMENT PRIMARY KEY,
    case_number         VARCHAR(50) NOT NULL,
    patient_name        VARCHAR(50) NOT NULL,
    doctor_id           INT         NOT NULL,
    product_type_id     INT         NOT NULL,
    due_date            DATE        NOT NULL,
    pan_number          VARCHAR(50),
    tooth_numbers       VARCHAR(200),
    arch_type           ENUM('upper','lower','both','n/a') DEFAULT 'n/a',
    shade               VARCHAR(50) DEFAULT 'N/A',
    material            VARCHAR(200),
    priority            ENUM('normal','rush','SPS') DEFAULT 'normal',
    current_status      ENUM('floating','in_progress','completed','on hold') DEFAULT 'floating',
    current_holder_id   INT,
    current_location_id INT,
    is_active           BOOLEAN     DEFAULT TRUE,
    created_at          TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES DOCTOR (doctor_id),
    FOREIGN KEY (product_type_id) REFERENCES PRODUCT_TYPE (product_type_id),
    FOREIGN KEY (current_holder_id) REFERENCES EMPLOYEE (employee_id),
    FOREIGN KEY (current_location_id) REFERENCES LOCATION (location_id)
);

-- ============================================================
-- CASE_PROCESS
-- ============================================================
CREATE TABLE CASE_PROCESS
(
    case_process_id      INT AUTO_INCREMENT PRIMARY KEY,
    case_id              INT NOT NULL,
    process_id           INT NOT NULL,
    sequence_order       INT NOT NULL,
    assigned_employee_id INT,
    scheduled_start      DATE,
    scheduled_end        DATE,
    actual_start         DATETIME,
    actual_end           DATETIME,
    status               ENUM('pending','assigned','in_progress','completed','skipped') DEFAULT 'pending',
    days_variance        INT       DEFAULT 0,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES `CASE` (case_id),
    FOREIGN KEY (process_id) REFERENCES PROCESS (process_id),
    FOREIGN KEY (assigned_employee_id) REFERENCES EMPLOYEE (employee_id)
);

-- ============================================================
-- SCAN_LOG
-- ============================================================
CREATE TABLE SCAN_LOG
(
    scan_id         INT AUTO_INCREMENT PRIMARY KEY,
    case_id         INT      NOT NULL,
    case_process_id INT,
    employee_id     INT      NOT NULL,
    scan_type       ENUM('in','out') NOT NULL,
    scan_time       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES `CASE` (case_id),
    FOREIGN KEY (case_process_id) REFERENCES CASE_PROCESS (case_process_id),
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE (employee_id)
);

-- ============================================================
-- CASE_NOTE
-- ============================================================
CREATE TABLE CASE_NOTE
(
    note_id      INT AUTO_INCREMENT PRIMARY KEY,
    case_id      INT  NOT NULL,
    employee_id  INT  NOT NULL,
    note_content TEXT NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES `CASE` (case_id),
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE (employee_id)
);

-- ============================================================
-- ISSUE
-- ============================================================
CREATE TABLE ISSUE
(
    issue_id                INT AUTO_INCREMENT PRIMARY KEY,
    case_id                 INT  NOT NULL,
    case_process_id         INT  NOT NULL,
    issue_type              ENUM('material_shortage','incorrect_shade','quality_check_failed',
                                 'missing_information','scan_quality','waiting_for_parts',
                                 'equipment_malfunction','etc') NOT NULL,
    reported_by_employee_id INT  NOT NULL,
    message                 TEXT NOT NULL,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES `CASE` (case_id),
    FOREIGN KEY (case_process_id) REFERENCES CASE_PROCESS (case_process_id),
    FOREIGN KEY (reported_by_employee_id) REFERENCES EMPLOYEE (employee_id)
);

-- ============================================================
-- ALERT
-- ============================================================
CREATE TABLE ALERT
(
    alert_id               INT AUTO_INCREMENT PRIMARY KEY,
    case_id                INT  NOT NULL,
    case_process_id        INT,
    alert_type             ENUM('overdue','process_issue','general') NOT NULL,
    message                TEXT NOT NULL,
    issue_id               INT,
    is_resolved            BOOLEAN   DEFAULT FALSE,
    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at            TIMESTAMP,
    resolve_by_employee_id INT,
    FOREIGN KEY (case_id) REFERENCES `CASE` (case_id),
    FOREIGN KEY (case_process_id) REFERENCES CASE_PROCESS (case_process_id),
    FOREIGN KEY (issue_id) REFERENCES ISSUE (issue_id),
    FOREIGN KEY (resolve_by_employee_id) REFERENCES EMPLOYEE (employee_id)
);

-- ============================================================
-- ALERT_READ_STATUS
-- ============================================================
CREATE TABLE ALERT_READ_STATUS
(
    alert_read_id INT AUTO_INCREMENT PRIMARY KEY,
    alert_id      INT NOT NULL,
    employee_id   INT NOT NULL,
    is_read       BOOLEAN DEFAULT FALSE,
    read_at       DATETIME,
    UNIQUE KEY uk_alert_employee (alert_id, employee_id),
    FOREIGN KEY (alert_id) REFERENCES ALERT (alert_id),
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE (employee_id)
);

-- ============================================================
-- NOTIFICATION
-- ============================================================
CREATE TABLE NOTIFICATION
(
    notification_id   INT AUTO_INCREMENT PRIMARY KEY,
    employee_id       INT  NOT NULL,
    case_id           INT  NOT NULL,
    notification_type ENUM('case_assignment','issue_resolved','due_date_changed',
                           'instruction_updated','case_note_added') NOT NULL,
    message           TEXT NOT NULL,
    is_read           BOOLEAN   DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE (employee_id),
    FOREIGN KEY (case_id) REFERENCES `CASE` (case_id)
);

-- ============================================================
-- TEST DATA
-- ============================================================

-- ============================================================
-- 1. LOCATION
-- ============================================================
INSERT INTO LOCATION (location_name, location_code, location_type, parent_location_id)
VALUES ('Lab Floor A', 'AREA-A', 'area', NULL),
       ('Reception Room', 'ROOM-RCP', 'room', 1),
       ('Wax & Model Room', 'ROOM-WAX', 'room', 1),
       ('Metal/Casting Room', 'ROOM-CAST', 'room', 1),
       ('Porcelain Room', 'ROOM-PRC', 'room', 1),
       ('Finishing Room', 'ROOM-FIN', 'room', 1),
       ('QC Room', 'ROOM-QC', 'room', 1),
       ('Shipping Room', 'ROOM-SHIP', 'room', 1),
       ('Shelf A-01', 'SHELF-A01', 'shelf', 2),
       ('Shelf WAX-01', 'SHELF-W01', 'shelf', 3);

-- ============================================================
-- 2. PRODUCT_TYPE
-- ============================================================
INSERT INTO PRODUCT_TYPE (product_name, category)
VALUES ('PFM Crown', 'Crown'),           -- product_type_id = 1
       ('Full Zirconia Crown', 'Crown'), -- 2
       ('Implant Abutment', 'Implant'),  -- 3
       ('Partial Denture', 'Denture');
-- 4

-- ============================================================
-- 3. PROCESS
-- ============================================================
-- PFM Crown 워크플로우에 사용할 프로세스들
INSERT INTO PROCESS (process_name, process_code, duration_hours, default_location_id, description)
VALUES ('Case Intake & Inspection', 'INTAKE', 2, 2, 'Receive case, inspect impressions/models, log into system'),
       ('Die Trimming & Pinning', 'DIE', 4, 3, 'Trim dies, pin models for accurate working dies'),
       ('Wax-up', 'WAX', 8, 3, 'Sculpt wax pattern to desired anatomy'),
       ('Spruing & Investing', 'INVEST', 4, 4, 'Attach sprues, invest wax pattern in casting ring'),
       ('Burnout & Casting', 'CAST', 6, 4, 'Burn out wax, cast metal alloy'),
       ('Divesting & Sandblasting', 'DIVEST', 3, 4, 'Remove investment, sandblast casting'),
       ('Metal Finishing & Fit', 'METALFIT', 4, 4, 'Finish metal substructure, check marginal fit on die'),
       ('Porcelain Build-up', 'PRC', 8, 5, 'Layer and fire dental porcelain to metal framework'),
       ('Characterization & Glaze', 'GLAZE', 4, 5, 'Stain, characterize, and glaze final firing'),
       ('Finishing & Polishing', 'FINISH', 3, 6, 'Polish accessible metal areas, check occlusion'),
       ('Quality Control', 'QC', 2, 7, 'Final inspection against Rx; shade, margins, contacts'),
       ('Packaging & Shipping', 'SHIP', 1, 8, 'Package case, prepare shipping label, dispatch');

-- ============================================================
-- 4. PRODUCT_WORKFLOW  (PFM Crown — sequential 1-to-12)
-- ============================================================
-- product_type_id = 1 (PFM Crown)
INSERT INTO PRODUCT_WORKFLOW (product_type_id, process_id, sequence_order)
VALUES (1, 1, 1),   -- INTAKE
       (1, 2, 2),   -- DIE
       (1, 3, 3),   -- WAX
       (1, 4, 4),   -- INVEST
       (1, 5, 5),   -- CAST
       (1, 6, 6),   -- DIVEST
       (1, 7, 7),   -- METALFIT
       (1, 8, 8),   -- PRC
       (1, 9, 9),   -- GLAZE
       (1, 10, 10), -- FINISH
       (1, 11, 11), -- QC
       (1, 12, 12);
-- SHIP

-- ============================================================
-- 5. DEPARTMENT
-- ============================================================
INSERT INTO DEPARTMENT (department_name, default_location_id, manager_id, is_active)
VALUES ('Intake & Model', 2, NULL, TRUE),  -- dept 1
       ('Wax & Framework', 3, NULL, TRUE), -- dept 2
       ('Casting', 4, NULL, TRUE),         -- dept 3
       ('Porcelain', 5, NULL, TRUE),       -- dept 4
       ('Finishing & QC', 6, NULL, TRUE),  -- dept 5
       ('Shipping', 8, NULL, TRUE);
-- dept 6

-- ============================================================
-- 6. EMPLOYEE
-- ============================================================
INSERT INTO EMPLOYEE (employee_name, department_id, role, default_location_id, shift_start, shift_end, is_manager,
                      is_active, is_on_duty)
VALUES
-- Dept 1: Intake
('Alice Kim', 1, 'Intake Technician', 2, '08:00:00', '17:00:00', TRUE, TRUE, TRUE),      -- emp 1
('Bob Lee', 1, 'Intake Technician', 2, '08:00:00', '17:00:00', FALSE, TRUE, TRUE),       -- emp 2
-- Dept 2: Wax
('Carol Park', 2, 'Senior Wax Tech', 3, '08:00:00', '17:00:00', TRUE, TRUE, TRUE),       -- emp 3
('David Yoon', 2, 'Wax Technician', 3, '08:00:00', '17:00:00', FALSE, TRUE, TRUE),       -- emp 4
-- Dept 3: Casting
('Ethan Cho', 3, 'Casting Technician', 4, '08:00:00', '17:00:00', TRUE, TRUE, TRUE),     -- emp 5
-- Dept 4: Porcelain
('Fiona Jung', 4, 'Senior Porcelain Tech', 5, '08:00:00', '17:00:00', TRUE, TRUE, TRUE), -- emp 6
('Grace Han', 4, 'Porcelain Technician', 5, '08:00:00', '17:00:00', FALSE, TRUE, TRUE),  -- emp 7
-- Dept 5: Finishing & QC
('Henry Oh', 5, 'Finishing Technician', 6, '08:00:00', '17:00:00', TRUE, TRUE, TRUE),    -- emp 8
('Irene Choi', 5, 'QC Inspector', 7, '08:00:00', '17:00:00', FALSE, TRUE, TRUE),         -- emp 9
-- Dept 6: Shipping
('James Kang', 6, 'Shipping Coordinator', 8, '09:00:00', '18:00:00', TRUE, TRUE, TRUE),  -- emp 10
-- Account Manager (no specific dept)
('Susan Bae', NULL, 'Account Manager', 2, '09:00:00', '18:00:00', FALSE, TRUE, TRUE);
-- emp 11

-- Update department managers
UPDATE DEPARTMENT
SET manager_id = 1
WHERE department_id = 1;
UPDATE DEPARTMENT
SET manager_id = 3
WHERE department_id = 2;
UPDATE DEPARTMENT
SET manager_id = 5
WHERE department_id = 3;
UPDATE DEPARTMENT
SET manager_id = 6
WHERE department_id = 4;
UPDATE DEPARTMENT
SET manager_id = 8
WHERE department_id = 5;
UPDATE DEPARTMENT
SET manager_id = 10
WHERE department_id = 6;

-- ============================================================
-- 7. EMPLOYEE_PROCESS_CAPABILITY
-- ============================================================
INSERT INTO EMPLOYEE_PROCESS_CAPABILITY (employee_id, process_id)
VALUES
-- Alice & Bob: Intake
(1, 1),
(2, 1),
-- Carol & David: Die, Wax
(3, 2),
(3, 3),
(4, 2),
(4, 3),
-- Ethan: Invest, Cast, Divest, MetalFit
(5, 4),
(5, 5),
(5, 6),
(5, 7),
-- Fiona & Grace: Porcelain, Glaze
(6, 8),
(6, 9),
(7, 8),
(7, 9),
-- Henry: Finishing
(8, 10),
-- Irene: QC
(9, 11),
-- James: Shipping
(10, 12);

-- ============================================================
-- 8. CLINIC
-- ============================================================
INSERT INTO CLINIC (clinic_name, clinic_alias, address, email, phone_number, shipping_instruction,
                    assigned_account_manager_id, is_active)
VALUES ('Bright Smile Dental', 'BSD', '123 Main St, Los Angeles, CA 90001', 'order@brightsmile.com', '310-555-1001',
        'Double-box all restorations. Include packing slip on top.', 11, TRUE),
       ('Sunrise Orthodontics', 'SRO', '456 Oak Ave, Pasadena, CA 91101', 'lab@sunriseortho.com', '626-555-2002',
        'Ship via FedEx Priority. No UPS.', 11, TRUE),
       ('Pacific Family Dental', 'PFD', '789 Beach Blvd, Long Beach, CA 90802', 'info@pacificfamily.com',
        '562-555-3003', 'Deliver by 10 AM on due date.', 11, TRUE);

-- ============================================================
-- 9. DOCTOR
-- ============================================================
INSERT INTO DOCTOR (doctor_name, clinic_id, email, phone_number, preferences, is_active)
VALUES ('Dr. Michael Chen', 1, 'mchen@brightsmile.com', '310-555-1011',
        'Prefers A2 as default shade. Always mark Rx form with patient DOB.', TRUE),
       ('Dr. Sarah Williams', 1, 'swilliams@brightsmile.com', '310-555-1012', 'Strong contacts, light occlusion.',
        TRUE),
       ('Dr. Jason Park', 2, 'jpark@sunriseortho.com', '626-555-2011', 'Very precise margins. Call before shipping.',
        TRUE),
       ('Dr. Emily Nguyen', 3, 'anguyen@pacificfamily.com', '562-555-3011',
        'Likes slightly warmer shades. Prefers rounded cusps.', TRUE);

-- ============================================================
-- 10. CASE  (4 test cases — all PFM Crown, product_type_id=1)
-- ============================================================
INSERT INTO `CASE` (case_number, patient_name, doctor_id, product_type_id, due_date, pan_number, tooth_numbers,
                    arch_type, shade, material, priority, current_status, current_holder_id, current_location_id)
VALUES ('250001', 'John Doe', 1, 1, '2025-07-20', '042W', '#14', 'upper', 'A2', 'Palladium-Silver', 'normal',
        'in_progress', 3, 3),
       ('250002', 'Jane Smith', 2, 1, '2025-07-18', '117B', '#30', 'lower', 'B3', 'Palladium-Silver', 'rush',
        'in_progress', 5, 4),
       ('250003', 'Tom Brown', 3, 1, '2025-07-25', '203V', '#3,#4', 'upper', 'A3', 'High Noble Gold', 'normal',
        'floating', NULL, 2),
       ('250004', 'Lisa Wilson', 4, 1, '2025-07-15', '089G', '#19', 'lower', 'A1', 'Palladium-Silver', 'SPS',
        'completed', 10, 8);

-- ============================================================
-- 11. CASE_PROCESS  (full 12-step workflow per case)
-- ============================================================

-- Helper: case_id=1 (CASE-2025-001) — currently at step 3 (Wax-up, in_progress)
INSERT INTO CASE_PROCESS (case_id, process_id, sequence_order, assigned_employee_id, scheduled_start, scheduled_end,
                          actual_start, actual_end, status, days_variance)
VALUES (1, 1, 1, 1, '2025-07-10', '2025-07-10', '2025-07-10 08:30:00', '2025-07-10 10:15:00', 'completed', 0),
       (1, 2, 2, 4, '2025-07-10', '2025-07-11', '2025-07-10 11:00:00', '2025-07-10 15:00:00', 'completed', 0),
       (1, 3, 3, 3, '2025-07-11', '2025-07-12', '2025-07-11 08:30:00', NULL, 'in_progress', 0),
       (1, 4, 4, 5, '2025-07-12', '2025-07-13', NULL, NULL, 'pending', 0),
       (1, 5, 5, 5, '2025-07-13', '2025-07-14', NULL, NULL, 'pending', 0),
       (1, 6, 6, 5, '2025-07-14', '2025-07-14', NULL, NULL, 'pending', 0),
       (1, 7, 7, 5, '2025-07-14', '2025-07-15', NULL, NULL, 'pending', 0),
       (1, 8, 8, 6, '2025-07-15', '2025-07-16', NULL, NULL, 'pending', 0),
       (1, 9, 9, 6, '2025-07-16', '2025-07-17', NULL, NULL, 'pending', 0),
       (1, 10, 10, 8, '2025-07-17', '2025-07-17', NULL, NULL, 'pending', 0),
       (1, 11, 11, 9, '2025-07-17', '2025-07-18', NULL, NULL, 'pending', 0),
       (1, 12, 12, 10, '2025-07-18', '2025-07-18', NULL, NULL, 'pending', 0);

-- case_id=2 (CASE-2025-002, rush) — currently at step 5 (Casting, in_progress)
INSERT INTO CASE_PROCESS (case_id, process_id, sequence_order, assigned_employee_id, scheduled_start, scheduled_end,
                          actual_start, actual_end, status, days_variance)
VALUES (2, 1, 1, 2, '2025-07-09', '2025-07-09', '2025-07-09 08:15:00', '2025-07-09 10:00:00', 'completed', 0),
       (2, 2, 2, 3, '2025-07-09', '2025-07-09', '2025-07-09 10:30:00', '2025-07-09 14:00:00', 'completed', 0),
       (2, 3, 3, 4, '2025-07-10', '2025-07-10', '2025-07-10 08:00:00', '2025-07-10 16:00:00', 'completed', 0),
       (2, 4, 4, 5, '2025-07-11', '2025-07-11', '2025-07-11 08:00:00', '2025-07-11 12:00:00', 'completed', 0),
       (2, 5, 5, 5, '2025-07-11', '2025-07-12', '2025-07-11 13:00:00', NULL, 'in_progress', 1),
       (2, 6, 6, 5, '2025-07-12', '2025-07-12', NULL, NULL, 'pending', 0),
       (2, 7, 7, 5, '2025-07-12', '2025-07-13', NULL, NULL, 'pending', 0),
       (2, 8, 8, 7, '2025-07-13', '2025-07-14', NULL, NULL, 'pending', 0),
       (2, 9, 9, 6, '2025-07-14', '2025-07-15', NULL, NULL, 'pending', 0),
       (2, 10, 10, 8, '2025-07-15', '2025-07-15', NULL, NULL, 'pending', 0),
       (2, 11, 11, 9, '2025-07-15', '2025-07-16', NULL, NULL, 'pending', 0),
       (2, 12, 12, 10, '2025-07-16', '2025-07-16', NULL, NULL, 'pending', 0);

-- case_id=3 (CASE-2025-003) — floating, no processes started
INSERT INTO CASE_PROCESS (case_id, process_id, sequence_order, assigned_employee_id, scheduled_start, scheduled_end,
                          actual_start, actual_end, status, days_variance)
VALUES (3, 1, 1, NULL, '2025-07-14', '2025-07-14', NULL, NULL, 'pending', 0),
       (3, 2, 2, NULL, '2025-07-14', '2025-07-15', NULL, NULL, 'pending', 0),
       (3, 3, 3, NULL, '2025-07-15', '2025-07-16', NULL, NULL, 'pending', 0),
       (3, 4, 4, NULL, '2025-07-16', '2025-07-17', NULL, NULL, 'pending', 0),
       (3, 5, 5, NULL, '2025-07-17', '2025-07-18', NULL, NULL, 'pending', 0),
       (3, 6, 6, NULL, '2025-07-18', '2025-07-18', NULL, NULL, 'pending', 0),
       (3, 7, 7, NULL, '2025-07-18', '2025-07-19', NULL, NULL, 'pending', 0),
       (3, 8, 8, NULL, '2025-07-19', '2025-07-20', NULL, NULL, 'pending', 0),
       (3, 9, 9, NULL, '2025-07-20', '2025-07-21', NULL, NULL, 'pending', 0),
       (3, 10, 10, NULL, '2025-07-21', '2025-07-22', NULL, NULL, 'pending', 0),
       (3, 11, 11, NULL, '2025-07-22', '2025-07-23', NULL, NULL, 'pending', 0),
       (3, 12, 12, NULL, '2025-07-23', '2025-07-23', NULL, NULL, 'pending', 0);

-- case_id=4 (CASE-2025-004, SPS, completed) — all 12 steps done
INSERT INTO CASE_PROCESS (case_id, process_id, sequence_order, assigned_employee_id, scheduled_start, scheduled_end,
                          actual_start, actual_end, status, days_variance)
VALUES (4, 1, 1, 1, '2025-07-07', '2025-07-07', '2025-07-07 08:00:00', '2025-07-07 09:30:00', 'completed', 0),
       (4, 2, 2, 4, '2025-07-07', '2025-07-07', '2025-07-07 10:00:00', '2025-07-07 13:30:00', 'completed', 0),
       (4, 3, 3, 3, '2025-07-08', '2025-07-08', '2025-07-08 08:00:00', '2025-07-08 16:00:00', 'completed', 0),
       (4, 4, 4, 5, '2025-07-09', '2025-07-09', '2025-07-09 08:00:00', '2025-07-09 12:00:00', 'completed', 0),
       (4, 5, 5, 5, '2025-07-09', '2025-07-09', '2025-07-09 13:00:00', '2025-07-09 17:00:00', 'completed', 0),
       (4, 6, 6, 5, '2025-07-10', '2025-07-10', '2025-07-10 08:00:00', '2025-07-10 10:30:00', 'completed', 0),
       (4, 7, 7, 5, '2025-07-10', '2025-07-10', '2025-07-10 11:00:00', '2025-07-10 14:30:00', 'completed', 0),
       (4, 8, 8, 6, '2025-07-11', '2025-07-11', '2025-07-11 08:00:00', '2025-07-11 16:00:00', 'completed', 0),
       (4, 9, 9, 6, '2025-07-12', '2025-07-12', '2025-07-12 08:00:00', '2025-07-12 11:30:00', 'completed', 0),
       (4, 10, 10, 8, '2025-07-12', '2025-07-12', '2025-07-12 12:00:00', '2025-07-12 14:30:00', 'completed', 0),
       (4, 11, 11, 9, '2025-07-13', '2025-07-13', '2025-07-13 08:00:00', '2025-07-13 09:30:00', 'completed', 0),
       (4, 12, 12, 10, '2025-07-13', '2025-07-13', '2025-07-13 10:00:00', '2025-07-13 11:00:00', 'completed', 0);

-- ============================================================
-- 12. SCAN_LOG
-- ============================================================
INSERT INTO SCAN_LOG (case_id, case_process_id, employee_id, scan_type, scan_time)
VALUES
-- Case 1: Intake 완료 scan in/out, Die 완료, Wax 시작
(1, 1, 1, 'in', '2025-07-10 08:30:00'),
(1, 1, 1, 'out', '2025-07-10 10:15:00'),
(1, 2, 4, 'in', '2025-07-10 11:00:00'),
(1, 2, 4, 'out', '2025-07-10 15:00:00'),
(1, 3, 3, 'in', '2025-07-11 08:30:00'),
-- Case 2: Intake~Cast
(2, 13, 2, 'in', '2025-07-09 08:15:00'),
(2, 13, 2, 'out', '2025-07-09 10:00:00'),
(2, 14, 3, 'in', '2025-07-09 10:30:00'),
(2, 14, 3, 'out', '2025-07-09 14:00:00'),
(2, 15, 4, 'in', '2025-07-10 08:00:00'),
(2, 15, 4, 'out', '2025-07-10 16:00:00'),
(2, 16, 5, 'in', '2025-07-11 08:00:00'),
(2, 16, 5, 'out', '2025-07-11 12:00:00'),
(2, 17, 5, 'in', '2025-07-11 13:00:00');

-- ============================================================
-- 13. CASE_NOTE
-- ============================================================
INSERT INTO CASE_NOTE (case_id, employee_id, note_content)
VALUES (1, 1, 'Impression looks good. Margin clear on #14. No bubbles noted.'),
       (1, 3,
        'Wax-up started. Occlusal anatomy adjusted per Dr. Chen preference - slightly reduced buccal cusp height.'),
       (2, 2, 'RUSH case flagged. Notified casting dept ahead of time.'),
       (2, 5, 'Casting delayed ~1 hour due to oven preheating issue. Back on track.'),
       (3, 1, 'Case received but missing bite registration. Called clinic — Dr. Park will send tomorrow.'),
       (4, 9, 'QC passed. Excellent margins, shade match A1 confirmed under daylight and lab light.'),
       (4, 10, 'Shipped via FedEx Priority. Tracking #794644782345. Delivered by 10 AM per clinic instruction.');

-- ============================================================
-- 14. ISSUE
-- ============================================================
INSERT INTO ISSUE (case_id, case_process_id, issue_type, reported_by_employee_id, message)
VALUES (2, 17, 'equipment_malfunction', 5,
        'Casting oven temperature sensor gave false reading. Delayed start by 1 hour. Issue resolved after manual reset.'),
       (3, 25, 'missing_information', 1,
        'Bite registration not included with case. Case placed on hold pending receipt from Dr. Park.');

-- ============================================================
-- 15. ALERT
-- ============================================================
INSERT INTO ALERT (case_id, case_process_id, alert_type, message, issue_id, is_resolved, resolved_at,
                   resolve_by_employee_id)
VALUES (2, 17, 'process_issue', 'Casting oven malfunction reported on CASE-2025-002. Step delayed.', 1, TRUE,
        '2025-07-11 15:00:00', 5),
       (3, 25, 'process_issue', 'CASE-2025-003 missing bite registration. Case on hold.', 2, FALSE, NULL, NULL),
       (2, NULL, 'overdue', 'CASE-2025-002 (RUSH) — Casting step is running 1 day behind schedule.', NULL, FALSE, NULL,
        NULL);

-- ============================================================
-- 16. ALERT_READ_STATUS
-- ============================================================
INSERT INTO ALERT_READ_STATUS (alert_id, employee_id, is_read, read_at)
VALUES (1, 5, TRUE, '2025-07-11 14:00:00'),
       (1, 8, TRUE, '2025-07-11 14:30:00'),
       (2, 1, TRUE, '2025-07-14 09:00:00'),
       (2, 3, FALSE, NULL),
       (3, 5, FALSE, NULL),
       (3, 8, FALSE, NULL);

-- ============================================================
-- 17. NOTIFICATION
-- ============================================================
INSERT INTO NOTIFICATION (employee_id, case_id, notification_type, message, is_read)
VALUES (3, 1, 'case_assignment',
        'You have been assigned to Wax-up for CASE-2025-001 (Patient: John Doe, #14 PFM Crown).', TRUE),
       (5, 2, 'case_assignment', 'You have been assigned to Casting for CASE-2025-002 (Patient: Jane Smith, RUSH).',
        TRUE),
       (1, 3, 'case_note_added', 'New note added to CASE-2025-003 by Alice Kim: missing bite registration.', FALSE),
       (10, 4, 'case_assignment', 'CASE-2025-004 is ready for Packaging & Shipping.', TRUE),
       (6, 4, 'instruction_updated', 'Dr. Nguyen updated shade preference to A1 on CASE-2025-004.', TRUE);