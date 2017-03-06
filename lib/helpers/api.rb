module Escritorio::Helpers::Api
  def success_json(body)
    res.headers["Content-Type"] = "application/json"
    res.write Oj.dump(body)
  end
end
