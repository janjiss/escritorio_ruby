require "tilt"

class Cuba
  module TemplateRender
    EXTENSION = "erb"
    LAYOUT    = "default"
    OPTIONS   = { default_encoding: Encoding.default_external }

    def template_render(template, locals = {}, layout = LAYOUT)
      res.headers["Content-Type"] ||= "text/html; charset=utf-8"
      res.write(template_view(template, locals, layout))
    end

    def template_view(template, locals = {}, layout = LAYOUT)
      partial(layout, locals.merge(content: template_partial(template, locals)))
    end

    def template_partial(template, locals = {})
      _render(template_path(template), locals, OPTIONS)
    end

    def template_path(template)
      return File.join(view_path, "#{ template }.#{ EXTENSION }")
    end

    def view_path
      File.expand_path(File.join("content/templates/#{config.template}"), Dir.pwd)
    end

    def config
      APP.resolve("repos.configurations").get_config
    end

    # @private Renders any type of template file supported by Tilt.
    #
    # @example
    #
    #   # Renders home, and is assumed to be HAML.
    #   _render("home.haml")
    #
    #   # Renders with some local variables
    #   _render("home.haml", site_name: "My Site")
    #
    #   # Renders with HAML options
    #   _render("home.haml", {}, ugly: true, format: :html5)
    #
    #   # Renders in layout
    #   _render("layout.haml") { _render("home.haml") }
    #
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
