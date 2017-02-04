class Escritorio::Repos::Configurations < ROM::Repository[:configurations]
  commands :create

  def get_config(id)
    configurations.by_pk(id).one
  end
end
