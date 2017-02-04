
class Escritorio::Routes::Public::Posts < Cuba
  define do
    on root do
      on get do
        posts = Escritorio::Repos::Posts.new(ROM_CONTAINER).all
        render "index", {
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
    on ":id" do
      on get do
        render "post", {
          meta_title: "Hello",
          meta_description: "Meta descition",
          body_class: "",
          navigation: "",
          ghost_head: "",
          ghost_foot: "",
          current_url: "",
          post: OpenStruct.new({
              id: 1,
              excerpt: "It's been a while since I started using ROM and one of the things I found missing is FactoryGirl like gem for pre-populating the database with",
              content: "It's been a while since I started using ROM and one of the things I found missing is FactoryGirl like gem for pre-populating the database with",
              title: "Walkthrough of my .vimrc file for Ruby development",
              body: "Post body",
              date: Date.today,
              author: OpenStruct.new(
                name: "Janis Miezitis"
              )
            }),
          blog: OpenStruct.new(url: "url", title: "Hello from escritorio", description: "Publishing platform")
        }
      end
    end
  end
end
