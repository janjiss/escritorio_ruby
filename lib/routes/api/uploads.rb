class Escritorio::Routes::Api::Uploads < Cuba
  define do
    on root do
      on post do
        file_name        = req.params["file"][:filename]
        tempfile         = req.params["file"][:tempfile]
        id               = req.params["id"]
        destination_path = File.join(UPLOADS_PATH, id)

        FileUtils.mkdir_p(destination_path)

        destination_file_path = File.join(destination_path, file_name)

        File.open(destination_file_path, "w") do |f|
          f.write(tempfile.read)
        end

        success_json(file: File.join("/uploads", id, file_name))
      end
    end
  end
end
