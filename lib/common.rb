require "cuba"
require "oj"

Oj.default_options = { symbol_keys: true, mode: :compat }

def require_files(path)
  Dir[path].sort.each { |rb| require rb }
end

module Escritorio
  Helpers = Module.new

  Routes = Class.new(Cuba)
end

