module Escritorio::Helpers::TemplateHelpers
  def asset_path(url)
    File.join("/admin/assets", url)
  end

  def template_asset_path(url)
    configuration = APP.resolve("repos.configurations").get_config
    File.join("/", "templates", configuration.template, "assets", url)
  end
end
