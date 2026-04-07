-- Supabase 数据库表结构
-- 在 Supabase Dashboard → SQL Editor 里执行以下 SQL 创建表

-- 创建分享报告表
CREATE TABLE IF NOT EXISTS share_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_code VARCHAR(12) UNIQUE NOT NULL,
  user_id TEXT,
  results JSONB NOT NULL,
  history JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
  is_active BOOLEAN DEFAULT TRUE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_share_reports_share_code ON share_reports(share_code);

-- 设置 RLS
ALTER TABLE share_reports ENABLE ROW LEVEL SECURITY;

-- 允许公开读取
CREATE POLICY "Allow public read" ON share_reports
  FOR SELECT
  USING (is_active = true AND expires_at > NOW());

-- 允许匿名插入
CREATE POLICY "Allow anonymous insert" ON share_reports
  FOR INSERT
  WITH CHECK (true);

-- 创建随机码生成函数
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS VARCHAR(12) AS $$
DECLARE
  chars VARCHAR(62) := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result VARCHAR(12) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * 62 + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器函数
CREATE OR REPLACE FUNCTION set_share_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_code IS NULL OR NEW.share_code = '' THEN
    NEW.share_code := generate_share_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_set_share_code ON share_reports;
CREATE TRIGGER trigger_set_share_code
BEFORE INSERT ON share_reports
FOR EACH ROW
EXECUTE FUNCTION set_share_code();