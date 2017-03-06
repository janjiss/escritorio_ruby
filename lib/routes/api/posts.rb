class Escritorio::Routes::Api::Posts < Cuba
  define do
    on root do
      on post do
        req.params[:raw] = Oj.dump(req.params[:raw])
        post = APP["repos.posts"].create(Escritorio::Models::Post.new(req.params))

        success_json(id: post.id)
      end
    end

    on ":id" do |id|
      on get do
        post = APP["repos.posts"].by_id(id)
        success_json(post.to_hash)
      end

      on put do
        req.params[:raw] = Oj.dump(req.params[:raw])
        post = Escritorio::Models::Post.new(req.params.merge(id: id.to_i))
        APP["repos.posts"].update(id.to_i, post)

        success_json(status: "ok")
      end
    end
  end
end
