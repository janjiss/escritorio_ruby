require_relative "../helper"
require "common"
require "relations/configurations"

class ConfigurationsTest < EscritorioTest
  def test_get_config
    Escritorio::Repos::Configurations.new(ROM_CONTAINER).transaction do
      configurationsRepo = Escritorio::Repos::Configurations.new(ROM_CONTAINER)
      configuration = Escritorio::Models::Configuration.new({template: "casper"})
      insert_configuration = configurationsRepo.create(configuration)

      get_config_resp = configurationsRepo.get_config(insert_configuration.id)
      assert_equal(get_config_resp.template, "casper")
    end
  end
end
