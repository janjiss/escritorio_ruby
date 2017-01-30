module Escritorio::Helpers::TemplateHelpers
  def asset(url)
    File.join("/", url)
  end
end
