class Cuba
  module TemplateThemeSetter
    module ClassMethods
      def set_template_theme(res)
        id_from_auth = 1
        configurations_repo = Escritorio::Repos::Configurations.new(ROM_CONTAINER)
        configuration = configurations_repo.get_config(id_from_auth)
        settings[:template_theme] = "/#{configuration.template}"
      end

      def get_template_theme()
        settings[:template_theme]
      end
    end
  end
end
