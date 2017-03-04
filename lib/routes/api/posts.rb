class Escritorio::Routes::Api::Posts < Cuba
  define do
    on root do
      on post do
        Escritorio::Models::Post.new(req.params)
      end
    end

    on ":id" do |id|
      on get do
        post = APP["repos.posts"].by_id(id)
        res.headers["Content-Type"] = "application/json"
        res.write Oj.dump(post.to_hash)
      end

      on put do
        json = Oj.load(req.params["json"])
        json[:raw] = Oj.dump(json[:raw])
        post = Escritorio::Models::Post.new(json.merge(id: id.to_i))
        APP["repos.posts"].update(id.to_i, post)
        res.write Oj.dump({ status: "ok" })
      end
    end
  end
end
