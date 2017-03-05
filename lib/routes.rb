require_files File.expand_path("routes/**/*.rb", __dir__)

module Escritorio
  class Routes < Cuba
    define do
      on "admin" do
        run Escritorio::Routes::Admin
      end

      on "api" do
        run Escritorio::Routes::Api
      end

      on default do
        run Escritorio::Routes::Public
      end
    end
  end
end
