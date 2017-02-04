require_relative  "./lib/common"

Cuba.plugin Cuba::CustomRender
Cuba.plugin Escritorio::Helpers::TemplateHelpers

Cuba.use Rack::Static,
  root: File.expand_path("content/templates/casper/assets", __dir__),
  urls: ["/js", "/css", "/images", "/fonts", "/videos"]

Cuba.define do
  run Escritorio::Routes
end
