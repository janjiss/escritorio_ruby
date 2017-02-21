ROM::SQL.migration do
  change do
    create_table :configurations do
      primary_key :id
      column :template, String, null: false
      column :blog_title, String, null: false
      column :blog_description, String, null: false
      column :blog_url, String, null: false
      column :blog_meta_title, String, null: false
      column :blog_meta_description, String, null: false
      column :blog_header_includes, String, null: false
      column :blog_footer_includes, String, null: false
    end
  end
end
