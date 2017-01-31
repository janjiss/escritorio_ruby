require_relative "../helper"
require "common"
require "relations/posts"

class PostsRelationsTest < EscritorioTest
  def test_all_posts
    expected_posts = [
      {title: "Hello Post", body_md: "Body of Hello post"},
      {title: "Hello Post 2", body_md: "Body of Hello post 2"}
    ]

    expected_posts.each do |p|
      DB[:posts].insert(p)
    end

    posts = Escritorio::Relations::Posts.new.all.to_a.map do |p|
      {title: p[:title], body_md: p[:body_md]}
    end

    assert_equal expected_posts, posts
  end
end
