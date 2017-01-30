class Escritorio::Routes::Api < Cuba
  define do
    on "posts" do
      run Escritorio::Routes::Api::Posts
    end
  end
end
