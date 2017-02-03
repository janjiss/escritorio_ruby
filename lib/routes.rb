require_files File.expand_path("routes/**/*.rb", __dir__)

module Escritorio
  class Routes < Cuba
    define do
      on default do
        run Escritorio::Routes::Public
      end
    end
  end
end
