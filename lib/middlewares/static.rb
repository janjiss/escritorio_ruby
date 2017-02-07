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
      urls: [ADMIN_ASSET_PATHS] + template_asset_paths
    ).call(env)
  end

  def template_asset_paths
    templates = Pathname.new(File.join(CONTENT_PATHS, "templates"))
      .children
      .select { |file| file.directory? }
      .map { |directory| File.join("/", "templates", directory.basename.to_s, "assets") }
  end
end

