require_relative "../helper"
require "rack/test"
require_relative "../../app"

class EscritorioTest < Minitest::Test
  include Rack::Test::Methods

  def app
    Cuba.app
  end
end
