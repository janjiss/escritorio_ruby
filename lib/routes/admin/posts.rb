class Escritorio::Routes::Admin::Posts < Cuba
  define do
    on root do
      on get do
        posts = APP.resolve('repos.posts').all
        render "posts", posts: posts
      end
    end

    on "new" do
      on get do
        render "edit", post_id: nil
      end
    end

    on ":id" do |id|
      post = APP["repos.posts"].by_id(id)

      on root do
        on get do
          render "edit", post_id: post.id
        end

        on post do
          APP["repos.posts"].delete(post.id)
          res.redirect "/admin/posts"
        end
      end
    end
  end
end
