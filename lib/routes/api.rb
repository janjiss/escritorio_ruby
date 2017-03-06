class Escritorio::Routes::Api < Cuba
  define do
    on "posts" do
      run Escritorio::Routes::Api::Posts
    end

    on "uploads" do
      run Escritorio::Routes::Api::Uploads
    end
  end
end
