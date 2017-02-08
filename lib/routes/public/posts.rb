class Escritorio::Routes::Public::Posts < Cuba
  define do
    config = APP.resolve('repos.configurations').get_config

    on root do
      on get do
        posts = APP.resolve('repos.posts').all
        template_render "index", {
          blog: config.blog,
          posts: posts,
          pagination: ""
        }
      end

    end
    on ":id" do |id|
      on get do
        post = APP.resolve('repos.posts').by_id(id)
        template_render "post", {
          current_url: "",
          post: post,
          blog: config.blog
        }
      end
    end
  end
end
