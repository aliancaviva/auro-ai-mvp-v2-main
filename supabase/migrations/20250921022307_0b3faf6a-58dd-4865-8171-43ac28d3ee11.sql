-- Update max_credits for existing users based on their current_plan
UPDATE profiles 
SET max_credits = CASE 
  WHEN current_plan = 'teste' THEN 5
  WHEN current_plan = 'micro' THEN 25  
  WHEN current_plan = 'meso' THEN 45
  WHEN current_plan = 'macro' THEN 999999
  ELSE 5  -- default to teste plan
END;

-- Update default value for new profiles to match teste plan
ALTER TABLE profiles ALTER COLUMN max_credits SET DEFAULT 5;

-- Update default plan to 'teste' for new users
ALTER TABLE profiles ALTER COLUMN current_plan SET DEFAULT 'teste';