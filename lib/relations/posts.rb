class Escritorio::Relations::Posts
  def all
    DB.select.from(:posts)
  end
end
