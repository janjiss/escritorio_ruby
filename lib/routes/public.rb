class Escritorio::Routes::Public < Cuba
  define do
    on "posts" do
      run Escritorio::Routes::Public::Posts
    end
  end
end
