class Escritorio::Routes::Public < Cuba
  define do
    on root do
      run Escritorio::Routes::Public::Posts
    end
    on "posts" do
      run Escritorio::Routes::Public::Posts
    end
  end
end
