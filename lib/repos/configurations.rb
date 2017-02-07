class Escritorio::Repos::Configurations < ROM::Repository[:configurations]
  commands :create

  def get_config
    configurations.one!
  end
end
