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
(1, 'Java là gì?', 'Easy', 1),
(2, 'JVM là gì?', 'Medium', 1),
(3, 'Spring Boot dùng để làm gì?', 'Easy', 3),
(4, 'SELECT là gì?', 'Easy', 2),
(5, 'JOIN là gì?', 'Medium', 2),
(6, 'HTML dùng để làm gì?', 'Easy', 4),
(7, 'CSS là gì?', 'Easy', 5),
(8, 'JavaScript chạy ở đâu?', 'Medium', 6),
(9, 'Python là gì?', 'Easy', 8),
(10, 'CI/CD là gì?', 'Hard', 9);

-- =======================
-- ANSWERS
-- =======================
INSERT INTO answers (id, text, question_id, is_correct) VALUES
(1, 'Ngôn ngữ lập trình', 1, true),
(2, 'Hệ điều hành', 1, false),
(3, 'Java Virtual Machine', 2, true),
(4, 'Tool build', 2, false),
(5, 'Framework backend', 3, true),
(6, 'Frontend tool', 3, false),
(7, 'Truy vấn dữ liệu', 4, true),
(8, 'Xóa dữ liệu', 4, false),
(9, 'Kết hợp bảng', 5, true),
(10, 'Xóa bảng', 5, false);

-- =======================
-- QUIZZES
-- =======================
INSERT INTO quizzes (id, title, created_at, total_quest, duration, user_id) VALUES
(1, 'Quiz 1', NOW(), 5, 30, 1),
(2, 'Quiz 2', NOW(), 5, 30, 1),
(3, 'Quiz 3', NOW(), 5, 30, 1),
(4, 'Quiz 4', NOW(), 5, 30, 1),
(5, 'Quiz 5', NOW(), 5, 30, 1),
(6, 'Quiz 6', NOW(), 5, 30, 1),
(7, 'Quiz 7', NOW(), 5, 30, 1),
(8, 'Quiz 8', NOW(), 5, 30, 1),
(9, 'Quiz 9', NOW(), 5, 30, 1),
(10, 'Quiz 10', NOW(), 5, 30, 1);

-- =======================
-- QUIZ_RULES
-- =======================
INSERT INTO quiz_rules (id, quiz_id, category_id, difficulty, num_questions) VALUES
(1, 1, 1, 'Easy', 2),
(2, 1, 2, 'Medium', 3),
(3, 2, 3, 'Easy', 2),
(4, 2, 4, 'Easy', 3),
(5, 3, 5, 'Easy', 2),
(6, 4, 6, 'Medium', 3),
(7, 5, 7, 'Easy', 2),
(8, 6, 8, 'Easy', 3),
(9, 7, 9, 'Hard', 2),
(10, 8, 10, 'Hard', 3);

-- =======================
-- QUIZ_VARIANTS
-- =======================
INSERT INTO quiz_variants (id, code, quiz_id, total_quest) VALUES
(1, 'A', 1, 5),
(2, 'B', 1, 5),
(3, 'A', 2, 5),
(4, 'B', 2, 5),
(5, 'A', 3, 5),
(6, 'B', 3, 5),
(7, 'A', 4, 5),
(8, 'B', 4, 5),
(9, 'A', 5, 5),
(10, 'B', 5, 5);

-- =======================
-- QUIZ_VARIANT_QUESTION
-- =======================
INSERT INTO quiz_variant_question (variant_id, question_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),
(2,2),(2,3),(2,4),(2,5),(2,6),
(3,1),(3,3),(3,5),(3,7),(3,9);

-- =======================
-- QUIZ_VARIANT_ATTEMPTS
-- =======================
INSERT INTO quiz_attempts (id, user_id, variant_id, start_time, end_time, score) VALUES
(1,2,1,NOW(),NOW(),3),
(2,3,2,NOW(),NOW(),4),
(3,4,3,NOW(),NOW(),2),
(4,5,4,NOW(),NOW(),5),
(5,6,5,NOW(),NOW(),3),
(6,7,6,NOW(),NOW(),4),
(7,8,7,NOW(),NOW(),1),
(8,9,8,NOW(),NOW(),2),
(9,10,9,NOW(),NOW(),5),
(10,2,10,NOW(),NOW(),4);

-- =======================
-- USER_ANSWERS
-- =======================
INSERT INTO user_answer (id, attempt_id, question_id, selected_answer_id, correct) VALUES
(1,1,1,1,true),
(2,1,2,3,true),
(3,2,3,5,true),
(4,2,4,7,true),
(5,3,5,10,false),
(6,4,1,2,false),
(7,5,2,3,true),
(8,6,3,6,false),
(9,7,4,7,true),
(10,8,5,9,true);