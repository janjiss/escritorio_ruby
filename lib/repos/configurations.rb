class Escritorio::Repos::Configurations < ROM::Repository[:configurations]
  commands :create

  def get_config
    Escritorio::Modules::MemoryCache.fetch_cache(:config) do
      configurations.one!
    end
  end
end
