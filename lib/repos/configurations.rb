class Escritorio::Repos::Configurations < ROM::Repository[:configurations]
  commands :create

  def get_config
    Escritorio::Modules::MemoryCache.fetch_cache(:config) do
      configurations.as(Escritorio::Models::Configuration).one!
    end
  end
end
