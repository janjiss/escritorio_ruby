require "minitest/autorun"

APP_DIR = Dir.pwd
WEBAPP_DIR = File.join(APP_DIR, "lib")
$LOAD_PATH.unshift(WEBAPP_DIR)

class EscritorioTest < Minitest::Test
  def run
    res = nil
    DB.transaction do
      res = super
      raise Sequel::Rollback
    end
    res
  end
end
