require "tilt"

class Cuba
  module TemplateRenderer
    EXTENSION = "erb"
    LAYOUT    = "default"
    VIEW_PATH = File.expand_path("content/templates/", Dir.pwd)
    OPTIONS   = { default_encoding: Encoding.default_external }
    CONFIG_HELPER = Escritorio::Helpers::Configurations

    def self.setup(app)
    end

    def render(template, locals = {}, layout = LAYOUT)
      locals = CONFIG_HELPER.assign_config(locals)
      res.headers["Content-Type"] ||= "text/html; charset=utf-8"
      res.write(view(template, locals, layout))
    end

    def view(template, locals = {}, layout = LAYOUT)
      partial(layout, locals.merge(content: partial(template, locals)))
    end

    def partial(template, locals = {})
      _render(template_path(template, locals), locals, OPTIONS)
    end

    def template_path(template, locals)
      return File.join(VIEW_PATH + "/#{locals[:template_theme_name]}", "#{ template }.#{ EXTENSION }")
    end

    def _render(template, locals = {}, options = {}, &block)
      _cache.fetch(template) {
        Tilt.new(template, 1, options.merge(outvar: '@_output'))
      }.render(self, locals, &block)
    end

    # @private Used internally by #_render to cache the
    #          Tilt templates.
    def _cache
      Thread.current[:_cache] ||= Tilt::Cache.new
    end
  end
end
