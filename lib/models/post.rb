class Escritorio::Models::Post < Dry::Struct
  constructor_type :schema

  attribute :id, Types::Strict::Int.optional
  attribute :title, Types::Strict::String
  attribute :raw, Types::Strict::String
  attribute :body, Types::Strict::String
  attribute :created_at, Types::DateTime.default { DateTime.now }
  attribute :updated_at, Types::DateTime.default { DateTime.now }

  def image
    ""
  end

  def meta_title
    title
  end

  def meta_description
    title
  end

  def excerpt
    "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the.."
  end

  def content
    body
  end

  def date
    Date.today
  end

  def author
    OpenStruct.new(
      name: "Janis Miezitis"
    )
  end
end
