class Escritorio::Routes::Api < Cuba
  plugin Escritorio::Helpers::Responses::API

  define do
    on "posts" do
      run Escritorio::Routes::Api::Posts
    end
  end
end
