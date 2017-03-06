require_relative  "./lib/common"

Cuba.plugin Cuba::CustomRender
Cuba.plugin Cuba::TemplateRender
Cuba.plugin Escritorio::Helpers::TemplateHelpers

json_load_object = ->(data) {
  data.force_encoding(Encoding::UTF_8)
  fail ArgumentError, "Invalid JSON input, was expecting valid UTF-8 encoding" unless data.valid_encoding?

  obj = Oj.load(data)
  fail ArgumentError, "Unexpected JSON input, was expecting an object" unless obj.is_a?(Hash)

  obj
}

Cuba.use Rack::Parser,
  parsers:  { "application/json" => json_load_object },
  handlers: { %r(json) => proc do |err, type|
                            [400, { "Content-Type" => type }, [Oj.dump({ "Bad Request" => err.to_s })]]
                          end }

Cuba.use Escritorio::Middlewares::Static
Cuba.use Rack::Static, root: "public", :urls => ["uploads"]

Cuba.define do
  run Escritorio::Routes
end
