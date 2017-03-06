class Escritorio::Routes::Api::Uploads < Cuba
  define do
    on root do
      on post do
        file_name    = req.params["file"][:filename]
        tempfile     = req.params["file"][:tempfile]
        id = req.params["id"]
        uploads_path = File.join(APP_DIR, "public", "uploads", id)

        FileUtils.mkdir_p(uploads_path)

        uploaded_file_path = File.join(uploads_path, file_name)

        File.open(uploaded_file_path, "w") do |f|
          f.write(tempfile.read)
        end

        res.write(Oj.dump({file: File.join("/uploads", id, file_name)}))
      end
    end
  end
end
