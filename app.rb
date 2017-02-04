require_relative  "./lib/common"
require "pry"

Cuba.plugin Cuba::TemplateRenderer
Cuba.plugin Escritorio::Helpers::TemplateHelpers

Cuba.use Rack::Static,
  root: File.expand_path("content/", __dir__),
  urls: ["/templates"]

Cuba.define do
  run Escritorio::Routes
end
