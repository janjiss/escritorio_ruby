class Escritorio::Models::Configuration < Dry::Struct
  constructor_type :schema

  attribute :id, Types::Strict::Int.optional
  attribute :template, Types::Strict::String
  attribute :created_at, Types::DateTime.default { DateTime.now }
  attribute :updated_at, Types::DateTime.default { DateTime.now }

end
