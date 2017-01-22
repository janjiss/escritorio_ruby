class Escritorio::Routes::Api::Posts < Cuba
  plugin Escritorio::Helpers::Responses::API

  define do
    on root do
      on get do
        json(hello: "World")
      end
    end
  end
end
