require_relative "lib/common"

Dir[File.expand_path("lib/*.rb", __dir__)].sort.each { |rb| require rb }

Cuba.define do
  run Escritorio::Routes
end
