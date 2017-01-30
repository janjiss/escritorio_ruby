class Escritorio::Routes::Api::Posts < Cuba
  define do
    on "index" do
      on get do
        json({
          posts: [
            id: 1,
            uuid: "wWVCVmhxvpi2stKFg2l6uw==",
            title: "My first post is here",
            markdown_body: "# Header \n what is happing here today? \n nothing",
            tags: ["hello", "world"],
            author: "Janis Miezitis",
            published_at: "2016-04-23T18:25:43.511Z",
            updated_at: "2016-04-23T18:25:43.511Z"
          ]
        })
      end
    end
  end
end
