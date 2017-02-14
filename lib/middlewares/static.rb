require "rack/static"
require "pathname"

class Escritorio::Middlewares::Static
  CONTENT_PATHS     = File.expand_path("../../content/", __dir__).freeze
  ADMIN_ASSET_PATHS = "/admin/assets"

  def initialize(app)
    @app = app
  end

  def call(env)
    static = Rack::Static.new(
      @app,
      root: CONTENT_PATHS,
      urls: [ADMIN_ASSET_PATHS, template_asset_path]
    ).call(env)
  end

  def template_asset_path
    configuration = APP.resolve("repos.configurations").get_config
    File.join("/", "templates", configuration.template, "assets")
  end
end
