class Escritorio::Repos::Posts < ROM::Repository[:posts]
  commands :create, update: :by_pk, delete: :by_pk

  def by_id(id)
    posts.as(Escritorio::Models::Post).by_pk(id).one!
  end

  def all
    posts.as(Escritorio::Models::Post).to_a
  end
end
