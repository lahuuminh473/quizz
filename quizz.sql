
-- =======================
-- USERS (10)
-- =======================
INSERT INTO users (id, user_name, email, address, password, role) VALUES
(1, 'admin', 'admin@gmail.com', 'HCM', '123456', 'ADMIN'),
(2, 'user1', 'user1@gmail.com', 'HCM', '123456', 'USER'),
(3, 'user2', 'user2@gmail.com', 'HN', '123456', 'USER'),
(4, 'user3', 'user3@gmail.com', 'DN', '123456', 'USER'),
(5, 'user4', 'user4@gmail.com', 'CT', '123456', 'USER'),
(6, 'user5', 'user5@gmail.com', 'HP', '123456', 'USER'),
(7, 'user6', 'user6@gmail.com', 'QN', '123456', 'USER'),
(8, 'user7', 'user7@gmail.com', 'BD', '123456', 'USER'),
(9, 'user8', 'user8@gmail.com', 'VT', '123456', 'USER'),
(10, 'user9', 'user9@gmail.com', 'LA', '123456', 'USER');

-- =======================
-- CATEGORIES
-- =======================
INSERT INTO categories (id, name, description) VALUES
(1, 'Java', 'Java basic'),
(2, 'SQL', 'SQL queries'),
(3, 'Spring', 'Spring Boot'),
(4, 'HTML', 'Frontend'),
(5, 'CSS', 'Style'),
(6, 'JavaScript', 'JS basic'),
(7, 'C#', 'Dotnet'),
(8, 'Python', 'Python basic'),
(9, 'DevOps', 'CI/CD'),
(10, 'System Design', 'Architecture');

-- =======================
-- QUESTIONS
-- =======================
INSERT INTO questions (id, content, difficulty, category_id) VALUES
(1,'Java là gì?','Easy',1),
(2,'JVM là gì?','Medium',1),
(3,'Spring Boot dùng để làm gì?','Easy',3),
(4,'SELECT trong SQL dùng để làm gì?','Easy',2),
(5,'JOIN trong SQL là gì?','Medium',2),
(6,'HTML là gì?','Easy',4),
(7,'CSS dùng để làm gì?','Easy',5),
(8,'JavaScript chạy ở đâu?','Medium',6),
(9,'Python là gì?','Easy',8),
(10,'CI/CD là gì?','Hard',9),

(11,'Java có hỗ trợ OOP không?','Easy',1),
(12,'Interface trong Java là gì?','Medium',1),
(13,'Bean trong Spring là gì?','Medium',3),
(14,'Primary key là gì?','Easy',2),
(15,'Foreign key dùng để làm gì?','Medium',2),
(16,'Thẻ div dùng để làm gì?','Easy',4),
(17,'Flexbox là gì?','Medium',5),
(18,'Closure trong JS là gì?','Hard',6),
(19,'List trong Python là gì?','Easy',8),
(20,'Docker dùng để làm gì?','Medium',9),

(21,'Exception trong Java là gì?','Medium',1),
(22,'Annotation là gì?','Medium',1),
(23,'Dependency Injection là gì?','Medium',3),
(24,'Index trong SQL là gì?','Medium',2),
(25,'Group by dùng để làm gì?','Medium',2),
(26,'Form trong HTML là gì?','Easy',4),
(27,'Grid CSS là gì?','Medium',5),
(28,'Promise trong JS là gì?','Hard',6),
(29,'Tuple trong Python là gì?','Easy',8),
(30,'Pipeline CI/CD là gì?','Hard',9),

(31,'Thread là gì?','Medium',1),
(32,'Garbage Collection là gì?','Medium',1),
(33,'REST API là gì?','Easy',3),
(34,'Transaction trong DB là gì?','Medium',2),
(35,'Normalization là gì?','Hard',2),
(36,'Semantic HTML là gì?','Medium',4),
(37,'Position CSS là gì?','Easy',5),
(38,'Event loop JS là gì?','Hard',6),
(39,'Dictionary trong Python là gì?','Easy',8),
(40,'Kubernetes là gì?','Hard',9),

(41,'Lambda trong Java là gì?','Medium',1),
(42,'Stream API là gì?','Medium',1),
(43,'Spring Security dùng để làm gì?','Medium',3),
(44,'View trong SQL là gì?','Medium',2),
(45,'Stored procedure là gì?','Hard',2),
(46,'Meta tag là gì?','Easy',4),
(47,'Box model CSS là gì?','Easy',5),
(48,'Async/Await là gì?','Medium',6),
(49,'Virtualenv Python là gì?','Medium',8),
(50,'Monitoring system là gì?','Hard',9);

-- =======================
-- ANSWERS
-- =======================
INSERT INTO answers (text, question_id, is_correct) VALUES

-- Q1
('Ngôn ngữ lập trình',1,true),
('Hệ điều hành',1,false),
('Database',1,false),
('Trình duyệt',1,false),

-- Q2
('Java Virtual Machine',2,true),
('JavaScript VM',2,false),
('Compiler',2,false),
('IDE',2,false),

-- Q3
('Xây dựng backend nhanh',3,true),
('Thiết kế UI',3,false),
('Chạy game',3,false),
('Thiết kế đồ họa',3,false),

-- Q4
('Truy vấn dữ liệu',4,true),
('Xóa bảng',4,false),
('Tạo bảng',4,false),
('Update DB',4,false),

-- Q5
('Kết hợp bảng',5,true),
('Xóa bảng',5,false),
('Insert dữ liệu',5,false),
('Drop DB',5,false),

-- Q6
('Tạo cấu trúc web',6,true),
('Xử lý logic',6,false),
('Lưu DB',6,false),
('Build app',6,false),

-- Q7
('Style giao diện',7,true),
('Xử lý backend',7,false),
('Lưu dữ liệu',7,false),
('Compile code',7,false),

-- Q8
('Trình duyệt',8,true),
('Database',8,false),
('Server',8,false),
('OS',8,false),

-- Q9
('Ngôn ngữ lập trình',9,true),
('Database',9,false),
('IDE',9,false),
('OS',9,false),

-- Q10
('Tự động build/deploy',10,true),
('Chạy game',10,false),
('Viết UI',10,false),
('Test manual',10,false);
-- Q11 → Q50
INSERT INTO answers (text, question_id, is_correct) VALUES

('Có',11,true),('Không',11,false),('Chỉ web',11,false),('Chỉ mobile',11,false),
('Contract class',12,true),('Database',12,false),('UI',12,false),('OS',12,false),
('Object do Spring quản lý',13,true),('SQL table',13,false),('File',13,false),('Thread',13,false),
('Khóa chính',14,true),('Index',14,false),('View',14,false),('Join',14,false),
('Liên kết bảng',15,true),('Xóa bảng',15,false),('Insert',15,false),('Update',15,false),

('Container layout',16,true),('DB',16,false),('API',16,false),('Logic',16,false),
('Layout system',17,true),('DB',17,false),('Thread',17,false),('API',17,false),
('Function giữ state',18,true),('Loop',18,false),('Class',18,false),('Array',18,false),
('Danh sách',19,true),('Key-value',19,false),('Tuple',19,false),('Set',19,false),
('Container hóa app',20,true),('UI',20,false),('Game',20,false),('DB',20,false),

('Lỗi runtime',21,true),('Compile',21,false),('Logic',21,false),('Syntax',21,false),
('Metadata',22,true),('DB',22,false),('UI',22,false),('Thread',22,false),
('Inject dependency',23,true),('SQL',23,false),('HTML',23,false),('Thread',23,false),
('Tăng tốc query',24,true),('Delete',24,false),('Insert',24,false),('Update',24,false),
('Group dữ liệu',25,true),('Delete',25,false),('Insert',25,false),('Join',25,false),

('Form nhập liệu',26,true),('DB',26,false),('API',26,false),('Thread',26,false),
('Layout grid',27,true),('DB',27,false),('API',27,false),('Thread',27,false),
('Async object',28,true),('Loop',28,false),('Class',28,false),('Array',28,false),
('Immutable list',29,true),('Set',29,false),('Dict',29,false),('Array',29,false),
('Chuỗi pipeline',30,true),('Loop',30,false),('Thread',30,false),('DB',30,false),

('Luồng xử lý',31,true),('DB',31,false),('API',31,false),('UI',31,false),
('Thu gom bộ nhớ',32,true),('DB',32,false),('API',32,false),('Thread',32,false),
('API RESTful',33,true),('UI',33,false),('DB',33,false),('Thread',33,false),
('Đảm bảo ACID',34,true),('UI',34,false),('API',34,false),('Thread',34,false),
('Chuẩn hóa DB',35,true),('UI',35,false),('API',35,false),('Thread',35,false),

('HTML có ý nghĩa',36,true),('CSS',36,false),('JS',36,false),('DB',36,false),
('Thuộc tính CSS',37,true),('DB',37,false),('API',37,false),('Thread',37,false),
('Loop xử lý async',38,true),('DB',38,false),('API',38,false),('Thread',38,false),
('Key-value',39,true),('List',39,false),('Set',39,false),('Tuple',39,false),
('Orchestrator',40,true),('DB',40,false),('API',40,false),('Thread',40,false),

('Anonymous function',41,true),('Class',41,false),('Thread',41,false),('DB',41,false),
('Xử lý collection',42,true),('DB',42,false),('Thread',42,false),('API',42,false),
('Bảo mật',43,true),('UI',43,false),('DB',43,false),('Thread',43,false),
('Bảng ảo',44,true),('Table',44,false),('Index',44,false),('Join',44,false),
('Procedure SQL',45,true),('Table',45,false),('Index',45,false),('View',45,false),

('Metadata',46,true),('DB',46,false),('API',46,false),('Thread',46,false),
('Box layout',47,true),('DB',47,false),('API',47,false),('Thread',47,false),
('Async code',48,true),('Loop',48,false),('Thread',48,false),('DB',48,false),
('Env Python',49,true),('DB',49,false),('API',49,false),('Thread',49,false),
('Giám sát hệ thống',50,true),('DB',50,false),('API',50,false),('Thread',50,false);
-- =======================
-- QUIZZES
-- =======================
INSERT INTO quizzes (id, title, created_at, total_quest, duration, user_id) VALUES
(1, 'Java Core Test', NOW(), 30, 45, 1),
(2, 'Backend Developer Test', NOW(), 30, 45, 1),
(3, 'Fullstack Test', NOW(), 30, 45, 1),
(4, 'SQL + DB Test', NOW(), 30, 45, 1),
(5, 'Frontend Test', NOW(), 30, 45, 1);

-- =======================
-- QUIZ_RULES
-- =======================
INSERT INTO quiz_rules (id, quiz_id, category_id, difficulty, num_questions) VALUES

-- Quiz 1 (Java)
(1,1,1,'Easy',10),
(2,1,1,'Medium',10),
(3,1,1,'Hard',10),

-- Quiz 2 (Backend)
(4,2,1,'Easy',5),
(5,2,3,'Medium',10),
(6,2,2,'Medium',10),
(7,2,9,'Hard',5),

-- Quiz 3 (Fullstack)
(8,3,4,'Easy',5),
(9,3,5,'Easy',5),
(10,3,6,'Medium',10),
(11,3,3,'Medium',5),
(12,3,1,'Hard',5),

-- Quiz 4 (SQL)
(13,4,2,'Easy',10),
(14,4,2,'Medium',10),
(15,4,2,'Hard',10),

-- Quiz 5 (Frontend)
(16,5,4,'Easy',10),
(17,5,5,'Medium',10),
(18,5,6,'Medium',10);

-- =======================
-- QUIZ_VARIANTS
-- =======================
INSERT INTO quiz_variants (id, code, quiz_id, total_quest) VALUES
(1,'A',1,30),(2,'B',1,30);


-- =======================
-- QUIZ_VARIANT_QUESTION
-- =======================
-- Variant 1 (Quiz 1 - A)
INSERT INTO quiz_variant_question (variant_id, question_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),
(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),
(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30);

-- Variant 2 (Quiz 1 - B, đảo khác)
INSERT INTO quiz_variant_question (variant_id, question_id) VALUES
(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),
(2,15),(2,16),(2,17),(2,18),(2,19),(2,20),(2,21),(2,22),(2,23),(2,24),
(2,25),(2,26),(2,27),(2,28),(2,29),(2,30),(2,31),(2,32),(2,33),(2,34);

