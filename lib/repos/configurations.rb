class Escritorio::Repos::Configurations < ROM::Repository[:configurations]
  commands :create

  def get_config
    configurations.as(Escritorio::Models::Configuration).one!
  end
end
