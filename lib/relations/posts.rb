class Escritorio::Relations::Posts < ROM::Relation[:sql]
  schema(:posts, infer: true)
end
