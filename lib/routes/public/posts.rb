class Escritorio::Routes::Public::Posts < Cuba
  define do
    config = APP.resolve('repos.configurations').get_config
    blog   = config.blog

    on root do
      on get do
        posts = APP.resolve('repos.posts').all
        template_render "index", {
          blog: blog,
          meta_title: blog.meta_title,
          meta_description: blog.meta_description,
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
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          post: post,
          blog: config.blog
        }
      end
    end
  end
end
