require "minitest/autorun"

require_relative "../lib/common"
require_relative "fixtures/content"

class EscritorioTest < Minitest::Test
  def run
    res = nil
    APP.resolve("repos.posts").transaction do
      res = super
      raise Sequel::Rollback
    end
    res
  end
end

class EscritorioConfigurationsTest < Minitest::Test
  def run
    res = nil
    APP.resolve("repos.configurations").transaction do
      res = super
      raise Sequel::Rollback
    end
    res
  end
end
