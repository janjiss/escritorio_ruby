module Escritorio::Helpers::Api
  def json(body)
    res.headers["Content-Type"] = "application/json"
    res.write Oj.dump(body)
  end
end
