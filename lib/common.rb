require "oj"
require "cuba"

module Escritorio
  Helpers = Module.new
  Plugins = Module.new

  Routes = Class.new(Cuba)
end

Oj.default_options = { symbol_keys: true, mode: :compat }

def require_files(path)
  Dir[path].sort.each { |rb| require rb }
end

require "routes"
require "helpers"
require "plugins"
