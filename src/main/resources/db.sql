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
    role                ENUM('technician','manager') NOT NULL DEFAULT 'technician',
    default_location_id INT,
    shift_start         TIME         NOT NULL,
    shift_end           TIME         NOT NULL,
    is_manager          BOOLEAN   DEFAULT FALSE,
    is_active           BOOLEAN   DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    clinic_alias                VARCHAR(200) NOT NULL,
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
    note_type    ENUM('general','alert','process_note') DEFAULT 'general',
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

-- LOCATION
INSERT INTO LOCATION (location_name, location_code, location_type)
VALUES ('Main Lab Room', 'ROOM-01', 'room'),
       ('CAD/CAM Area', 'AREA-01', 'area'),
       ('Storage Shelf A', 'SHELF-01', 'shelf');

-- PRODUCT_TYPE
INSERT INTO PRODUCT_TYPE (product_name, category)
VALUES ('Zirconia Crown', 'Fixed Prosthodontics'),
       ('PFM Crown', 'Fixed Prosthodontics'),
       ('Full Denture', 'Removable');

-- PROCESS
INSERT INTO PROCESS (process_name, process_code, duration_hours, default_location_id, description)
VALUES ('Scan', 'SCAN', 4, 1, 'Initial scan of the impression'),
       ('Design', 'DESIGN', 8, 2, 'CAD design of the restoration'),
       ('Mill', 'MILL', 6, 2, 'Milling the restoration from block'),
       ('Sinter', 'SINT', 8, 1, 'Sintering the zirconia'),
       ('Glaze', 'GLAZE', 4, 1, 'Glazing and finishing');

-- PRODUCT_WORKFLOW
-- Zirconia Crown: Scan→Design→Mill→Sinter→Glaze
INSERT INTO PRODUCT_WORKFLOW (product_type_id, process_id, sequence_order)
VALUES (1, 1, 1),
       (1, 2, 2),
       (1, 3, 3),
       (1, 4, 4),
       (1, 5, 5),
-- PFM Crown: Scan→Design→Mill→Glaze
       (2, 1, 1),
       (2, 2, 2),
       (2, 3, 3),
       (2, 5, 4);

-- DEPARTMENT (manager_id는 EMPLOYEE 삽입 후 UPDATE)
INSERT INTO DEPARTMENT (department_name, default_location_id)
VALUES ('CAD/CAM Department', 2),
       ('Finishing Department', 1),
       ('Management', 1);

-- EMPLOYEE
INSERT INTO EMPLOYEE (employee_name, department_id, role, default_location_id, shift_start, shift_end, is_manager)
VALUES ('Marcus Miller', 3, 'manager', 1, '08:00:00', '17:00:00', TRUE),
       ('Sarah Johnson', 1, 'technician', 2, '08:00:00', '17:00:00', FALSE),
       ('James Kim', 2, 'technician', 1, '08:00:00', '17:00:00', FALSE);

-- DEPARTMENT manager 업데이트
UPDATE DEPARTMENT
SET manager_id = 1
WHERE department_id = 3;
UPDATE DEPARTMENT
SET manager_id = 2
WHERE department_id = 1;
UPDATE DEPARTMENT
SET manager_id = 3
WHERE department_id = 2;

-- CLINIC
INSERT INTO CLINIC (clinic_name, clinic_alias, address, email, phone_number, assigned_account_manager_id)
VALUES ('Riverside Dental Center', 'Riverside', '123 River Rd, Seoul', 'riverside@dental.com', '02-1234-5678', 1),
       ('City Orthodontics', 'CityOrtho', '456 City Ave, Seoul', 'city@ortho.com', '02-2345-6789', 1),
       ('Smile Dental Clinic', 'Smile', '789 Smile Blvd, Seoul', 'smile@dental.com', '02-3456-7890', 1);

-- DOCTOR
INSERT INTO DOCTOR (doctor_name, clinic_id, email, preferences)
VALUES ('Dr. Emily Park', 1, 'emily@riverside.com', 'Prefers light occlusal contacts. All zirconia to be polished.'),
       ('Dr. James Wilson', 2, 'james@cityortho.com', 'Express shipping only.'),
       ('Dr. Lisa Chen', 3, 'lisa@smile.com', 'High translucency zirconia preferred.');

-- EMPLOYEE_PROCESS_CAPABILITY
INSERT INTO EMPLOYEE_PROCESS_CAPABILITY (employee_id, process_id)
VALUES (2, 1),
       (2, 2),
       (2, 3), -- Sarah: Scan, Design, Mill
       (3, 3),
       (3, 4),
       (3, 5);
-- James: Mill, Sinter, Glaze

-- CASE
INSERT INTO `CASE` (case_number, patient_name, doctor_id, product_type_id, due_date, pan_number, tooth_numbers,
                    arch_type, shade, material, priority, current_status, current_holder_id, current_location_id)
VALUES ('CASE-2024-0001', 'John Doe', 1, 1, '2024-03-15', 'PAN-01', '11,12,21,22', 'upper', 'A2',
        'Multi-layered Zirconia', 'normal', 'in_progress', 2, 2),
       ('CASE-2024-0002', 'Jane Smith', 2, 2, '2024-03-12', 'PAN-02', '36,37', 'lower', 'A3', 'E-Max', 'rush',
        'floating', NULL, 1),
       ('CASE-2024-0003', 'Bob Lee', 3, 1, '2024-03-20', 'PAN-03', '14,15,16', 'upper', 'B1', 'Multi-layered Zirconia',
        'normal', 'floating', NULL, 1);

-- CASE_PROCESS
INSERT INTO CASE_PROCESS (case_id, process_id, sequence_order, assigned_employee_id, scheduled_start, scheduled_end,
                          actual_start, actual_end, status)
VALUES
-- CASE-0001: Scan완료, Design진행중
(1, 1, 1, 2, '2024-03-10', '2024-03-10', '2024-03-10 09:00:00', '2024-03-10 13:00:00', 'completed'),
(1, 2, 2, 2, '2024-03-11', '2024-03-11', '2024-03-11 09:00:00', NULL, 'in_progress'),
(1, 3, 3, 3, '2024-03-12', '2024-03-12', NULL, NULL, 'pending'),
(1, 4, 4, 3, '2024-03-13', '2024-03-13', NULL, NULL, 'pending'),
(1, 5, 5, 3, '2024-03-14', '2024-03-14', NULL, NULL, 'pending'),
-- CASE-0002
(2, 1, 1, 2, '2024-03-10', '2024-03-10', NULL, NULL, 'pending'),
(2, 2, 2, 2, '2024-03-11', '2024-03-11', NULL, NULL, 'pending'),
(2, 3, 3, 3, '2024-03-12', '2024-03-12', NULL, NULL, 'pending'),
-- CASE-0003
(3, 1, 1, 2, '2024-03-15', '2024-03-15', NULL, NULL, 'pending'),
(3, 2, 2, 2, '2024-03-16', '2024-03-16', NULL, NULL, 'pending'),
(3, 3, 3, 3, '2024-03-17', '2024-03-17', NULL, NULL, 'pending'),
(3, 4, 4, 3, '2024-03-18', '2024-03-18', NULL, NULL, 'pending'),
(3, 5, 5, 3, '2024-03-19', '2024-03-19', NULL, NULL, 'pending');

-- SCAN_LOG
INSERT INTO SCAN_LOG (case_id, case_process_id, employee_id, scan_type, scan_time)
VALUES (1, 1, 2, 'in', '2024-03-10 09:00:00'),
       (1, 1, 2, 'out', '2024-03-10 13:00:00'),
       (1, 2, 2, 'in', '2024-03-11 09:00:00');

-- CASE_NOTE
INSERT INTO CASE_NOTE (case_id, employee_id, note_content, note_type)
VALUES (1, 2, 'Scan quality is good. Proceeding to design.', 'process_note'),
       (2, 1, 'Rush case - please prioritize.', 'alert'),
       (3, 2, 'Patient requested high translucency shade.', 'general');

-- ISSUE
INSERT INTO ISSUE (case_id, case_process_id, issue_type, reported_by_employee_id, message)
VALUES (2, 6, 'missing_information', 2, 'Missing high-res scan for margin adjustment.'),
       (1, 2, 'incorrect_shade', 2, 'Shade confirmation needed from doctor.'),
       (3, 9, 'scan_quality', 2, 'Initial scan quality low, rescan requested.');

-- ALERT
INSERT INTO ALERT (case_id, case_process_id, alert_type, message, issue_id, is_resolved)
VALUES (2, 6, 'process_issue', 'Missing scan data for Case #CASE-2024-0002', 1, FALSE),
       (1, 2, 'process_issue', 'Shade mismatch detected for Case #CASE-2024-0001', 2, FALSE),
       (3, 9, 'general', 'Low scan quality for Case #CASE-2024-0003', 3, FALSE);

-- ALERT_READ_STATUS
INSERT INTO ALERT_READ_STATUS (alert_id, employee_id, is_read)
VALUES (1, 1, FALSE),
       (2, 1, FALSE),
       (3, 1, TRUE);

-- NOTIFICATION
INSERT INTO NOTIFICATION (employee_id, case_id, notification_type, message)
VALUES (2, 1, 'case_assignment', 'You have been assigned to Case #CASE-2024-0001 - Design process.'),
       (3, 1, 'case_assignment', 'You have been assigned to Case #CASE-2024-0001 - Mill process.'),
       (2, 2, 'case_note_added', 'A new note has been added to Case #CASE-2024-0002.');