class Cuba
  module TemplateThemeSetter
    module ClassMethods
      def set_template_theme(res)
        id_from_auth = 1
        configurationsRepos = Escritorio::Repos::Configurations.new(ROM_CONTAINER)
        configuration = configurationsRepos.get_config(id_from_auth)
        settings[:template_theme] = "/#{configuration.template}"
      end

      def get_template_theme()
        settings[:template_theme]
      end
    end
  end
end
