class Escritorio::Repos::Posts < ROM::Repository[:posts]
  commands :create

  def all
    posts.as(Escritorio::Models::Post).to_a
  end
end
