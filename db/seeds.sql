INSERT INTO departments(name)
VALUES 
('Eulogy Enhancement Division'),
('Casket Design Coordinators'),
('Death Planning Bureau'),
('Memorial Music Managment'),
('Spectral Complaints Sector'),
('Corpse Style Studio'),
('Cadaver Credits & Finance'),
('Soul Sales'),
('Legal'),
('HR');

INSERT INTO roles(title, salary, department_id)
VALUES
('Junior Ghostwriter', 75000, 1),
('Senior GhostWriter', 110000, 1),
('SEO Specialist', 90000, 1),
('Creative Writing Manager', 90000, 1),
('Cheif Design Expert', 100000, 2),
('Jr. Design Expert', 80000, 2),
('Textile Technician', 40000, 2),
('Event Coordinator', 90000, 3),
('Venue Specialist', 60000, 3),
('Sustainability Manager', 2000, 3),
('DJ', 200000, 4),
('Spirit Service Representative', 80000, 5),
('Escalation Specialist', 90000, 5),
('Mediation Specialist', 90000, 5),
('Stylist', 80000, 6),
('Seamstress', 50000, 6),
('Makeup Artist', 50000, 6),
('Chief Corpse Analyst', 120000, 7),
('Corpse Financial Consultant', 80000, 7),
('Auditor', 80000, 7),
('Sales Lead', 90000, 8),
('Jr. Sales Specialist', 70000, 8),
('Lawyer', 1000, 9),
('HR Chief Council', 110000, 10),
('HR Council', 90000, 10),
('HR Premortem Paralegal', 50000, 10);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES 
('Peter', 'Boling', 4, 0),
('Nicholas', 'Attaway', 1, 1),
('Jessica', 'Wey', 18, 2),
('Vincent', 'Shury', 23, 1),
('Heinz', 'Ulrich', 26, 3),
('Christian', 'Ridgell', 15, 3),
('Ernest', 'Jones', 12, 2);