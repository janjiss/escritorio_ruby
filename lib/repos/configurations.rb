class Escritorio::Repos::Configurations < ROM::Repository[:configurations]
  commands :create

  def get_config
    Escritorio::Modules::MemoryCache.get_or_set(:config) do
      configurations.as(Escritorio::Models::Configuration).one!
    end
  end

  def update_config(id, data)
    Escritorio::Modules::MemoryCache.update_cache(:config, configurations.update(id, data))
  end
end
