class Escritorio::Routes::Public < Cuba
  define do
    Cuba.set_template_theme(res)
    on "posts" do
      run Escritorio::Routes::Public::Posts
    end
  end
end
