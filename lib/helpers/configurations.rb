module Escritorio::Helpers::Configurations
  class << self
    def assign_config(locals)
      locals[:template_theme_name] = get_template_name(get_config(locals))
      locals[:asset_path] = get_template_path(locals)
      locals
    end

    def get_config(locals)
      id_from_auth = 1
      configurations_repo = Escritorio::Repos::Configurations.new(ROM_CONTAINER)
      configurations_repo.get_config(id_from_auth)
    end

    private

    def get_template_name(config)
      if config
        config.template
      else
        "casper"
      end
    end

    def get_template_path(locals)
      "/templates/#{locals[:template_theme_name]}/assets/"
    end
  end
end
