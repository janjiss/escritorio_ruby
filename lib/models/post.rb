class Escritorio::Models::Post < Dry::Struct
  constructor_type :schema

  attribute :id, Types::Strict::Int.optional
  attribute :title, Types::Strict::String
  attribute :body_md, Types::Strict::String
  attribute :created_at, Types::DateTime.default { DateTime.now }
  attribute :updated_at, Types::DateTime.default { DateTime.now }

  def meta_title
    title
  end

  def excerpt
    body
  end

  def body
    Markdown.new(body_md).to_html
  end

  def date
    Date.today
  end

  def url
    "http://google.com"
  end

  def author
    OpenStruct.new(
      name: "Janis Miezitis"
    )
  end
end
