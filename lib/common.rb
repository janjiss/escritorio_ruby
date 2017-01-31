require "oj"
require "cuba"
require "sequel"

DB_PATH = File.join("sqlite://", "db", "mydb")

DB = Sequel.connect(DB_PATH)

module Escritorio
  Helpers   = Module.new
  Plugins   = Module.new
  Relations = Module.new

  Routes = Class.new(Cuba)
end

Oj.default_options = { symbol_keys: true, mode: :compat }

def require_files(path)
  Dir[path].sort.each { |rb| require rb }
end

require "routes"
require "helpers"
require "plugins"
require "relations"
