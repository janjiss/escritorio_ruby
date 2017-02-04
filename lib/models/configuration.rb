class Escritorio::Models::Configuration < Dry::Struct
  constructor_type :schema

  attribute :id, Types::Strict::Int.optional
  attribute :template, Types::Strict::String
end
