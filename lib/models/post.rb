class Escritorio::Models::Post < Dry::Struct
  constructor_type :strict_with_defaults

  attribute :id, Types::Strict::Int.optional
  attribute :title, Types::Strict::String
  attribute :body_md, Types::Strict::String

  def to_h
    super.select do |k, v|
      [k, v] if v
    end.to_h
  end
end
