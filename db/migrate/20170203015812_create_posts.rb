ROM::SQL.migration do
  change do
    create_table :posts do
      primary_key :id
      column :title, String, null: false
      column :body_md, String, null: false
    end
  end
end
