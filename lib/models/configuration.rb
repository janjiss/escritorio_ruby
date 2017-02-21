class Escritorio::Models::Configuration < Dry::Struct
  constructor_type :schema

  attribute :id, Types::Strict::Int.optional
  attribute :template, Types::Strict::String
  attribute :blog_title, Types::Strict::String
  attribute :blog_description, Types::Strict::String
  attribute :blog_url, Types::Strict::String
  attribute :blog_meta_title, Types::Strict::String
  attribute :blog_meta_description, Types::Strict::String
  attribute :blog_header_includes, Types::Strict::String
  attribute :blog_footer_includes, Types::Strict::String

  def blog
    Blog.new(
      title: blog_title,
      description: blog_description,
      url: blog_url,
      meta_title: blog_meta_title,
      meta_description: blog_meta_description,
      header_includes: blog_header_includes,
      footer_includes: blog_footer_includes
    )
  end

  class Blog < Dry::Struct
    constructor_type :schema

    attribute :title, Types::Strict::String
    attribute :description, Types::Strict::String
    attribute :url, Types::Strict::String
    attribute :meta_title, Types::Strict::String
    attribute :meta_description, Types::Strict::String
    attribute :header_includes, Types::Strict::String
    attribute :footer_includes, Types::Strict::String

    def cover
    end

    def logo
    end

    def navigation
    end
  end
end
