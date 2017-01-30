APP_DIR = Dir.pwd
WEBAPP_DIR = File.join(APP_DIR, "lib")
$LOAD_PATH.unshift(WEBAPP_DIR)

require "cuba"
require "tilt"
require "cuba/render"

require "common"

Cuba.plugin Escritorio::Helpers::TemplateHelpers
Cuba.plugin Cuba::Render

Cuba.use Rack::Static,
  root: File.expand_path("content/templates/casper/assets", __dir__),
  urls: ["/js", "/css", "/images", "/fonts", "/videos"]

Cuba.define do
  run Escritorio::Routes
end
