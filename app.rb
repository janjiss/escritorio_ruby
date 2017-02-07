require_relative  "./lib/common"

Cuba.plugin Cuba::CustomRender
Cuba.plugin Cuba::TemplateRender
Cuba.plugin Escritorio::Helpers::TemplateHelpers

Cuba.use Escritorio::Middlewares::Static

Cuba.define do
  run Escritorio::Routes
end
