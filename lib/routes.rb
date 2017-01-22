require_relative "./common"

require_files File.expand_path("routes/**/*.rb", __dir__)

class Escritorio::Routes < Cuba
  define do
    on "api" do
      run Escritorio::Routes::Api
    end
  end
end
