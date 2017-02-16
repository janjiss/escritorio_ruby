class Escritorio::Routes::Admin < Cuba
  define do
    on "posts" do
      run Escritorio::Routes::Admin::Posts
    end
  end
end
