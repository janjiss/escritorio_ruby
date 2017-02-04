class Escritorio::Models::Configuration < Dry::Struct
  constructor_type :strict_with_defaults

  attribute :id, Types::Strict::Int.optional
  attribute :template, Types::Strict::String

  def to_h
    super.select do |k, v|
      [k, v] if v
    end.to_h
  end
end
