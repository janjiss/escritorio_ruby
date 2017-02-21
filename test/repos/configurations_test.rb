require_relative "../helper"
class ConfigurationsTest < EscritorioConfigurationsTest

  def run
    Escritorio::Modules::MemoryCache.delete_cache(:config)
    self
  end

  def test_get_config
    config = APP.resolve("repos.configurations").get_config
    assert_instance_of(Escritorio::Models::Configuration, config)
  end

  def test_update_config
    config = APP.resolve("repos.configurations").get_config

    APP.resolve("repos.configurations").update_config(config.id, {template: "casper_2"})

    config = APP.resolve("repos.configurations").get_config

    assert_equal(config.template, "casper_2")
  end
end
