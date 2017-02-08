class Escritorio::Models::Post < Dry::Struct
  constructor_type :schema

  attribute :id, Types::Strict::Int.optional
  attribute :title, Types::Strict::String
  attribute :body_md, Types::Strict::String
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
    body
  end

  def content
    body
  end

  def body
    Markdown.new(body_md).to_html
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
