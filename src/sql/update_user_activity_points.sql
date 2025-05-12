
CREATE OR REPLACE FUNCTION update_user_activity_points(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_message_count INTEGER;
  v_group_count INTEGER;
  v_points INTEGER;
BEGIN
  -- Get message count
  SELECT COUNT(*) INTO v_message_count
  FROM chat_messages
  WHERE user_id = p_user_id;
  
  -- Get group count
  SELECT COUNT(*) INTO v_group_count
  FROM group_members
  WHERE user_id = p_user_id;
  
  -- Calculate points: 5 points per message, 10 points per group
  v_points := (v_message_count * 5) + (v_group_count * 10);
  
  -- Insert or update user activity
  INSERT INTO user_activity (user_id, messages_sent, groups_joined, last_active, activity_points)
  VALUES (p_user_id, v_message_count, v_group_count, NOW(), v_points)
  ON CONFLICT (user_id) 
  DO UPDATE SET
    messages_sent = v_message_count,
    groups_joined = v_group_count, 
    last_active = NOW(),
    activity_points = v_points;
END;
$$ LANGUAGE plpgsql;
