-- Seed data: achievements
INSERT INTO achievements (name, description, achievement_type, criteria)
VALUES
  ('First Puzzle', 'Complete your very first puzzle', 'milestone', '{"gamesCompleted": 1}'),
  ('Perfect Round', 'Answer all questions correctly in a single game', 'accuracy', '{"accuracy": 100}'),
  ('Speed Demon', 'Answer a question in under 3 seconds', 'speed', '{"elapsedMs": 3000}'),
  ('Hat Trick', 'Get 3 correct answers in a row', 'streak', '{"streak": 3}'),
  ('Banana Veteran', 'Play 10 games total', 'milestone', '{"gamesPlayed": 10}'),
  ('Top Scorer', 'Earn 500 total points', 'score', '{"totalPoints": 500}')
ON CONFLICT (name) DO NOTHING;

