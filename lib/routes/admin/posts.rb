class Escritorio::Routes::Admin::Posts < Cuba
  define do
    on root do
      on get do
        render "posts"
      end
    end
  end
end
