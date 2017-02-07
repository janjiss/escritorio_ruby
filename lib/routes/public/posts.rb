class Escritorio::Routes::Public::Posts < Cuba
  define do
    on root do
      on get do
        posts = APP.resolve('repos.posts').all
        template_render "index", {
          meta_title: "Hello",
          meta_description: "Meta descition",
          body_class: "",
          navigation: "",
          ghost_head: "",
          ghost_foot: "",
          blog: OpenStruct.new(url: "url", title: "Hello from escritorio", description: "Publishing platform"),
          posts: posts,
          pagination: ""
        }
      end

    end
    on ":id" do |id|
      on get do
        post = APP.resolve('repos.posts').by_id(id)
        template_render "post", {
          meta_title: "Hello",
          meta_description: "Meta descition",
          body_class: "",
          navigation: "",
          ghost_head: "",
          ghost_foot: "",
          current_url: "",
          post: post,
          blog: OpenStruct.new(url: "url", title: "Hello from escritorio", description: "Publishing platform")
        }
      end
    end
  end
end
