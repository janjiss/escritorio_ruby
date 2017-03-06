require_relative "../helper.rb"

module RoutesTest
  class ApiUploadsTest < EscritorioTest
    def setup
      file_path = File.join(APP_DIR, "/test/fixtures/test.png")
      @file = Rack::Test::UploadedFile.new(file_path, "image/jpeg")
    end

    def test_ok
      id = "test"
      post "/api/uploads", { id: id, file: @file }
      assert_equal 200, last_response.status
      response_body = { file: "/uploads/#{id}/test.png" }
      assert_equal response_body, Oj.load(last_response.body)
      assert File.exists?(File.join(APP_DIR, File.join("public", response_body[:file])))
      FileUtils.rm_r(File.join(APP_DIR, "/public/uploads/#{id}"))
    end
  end
end
