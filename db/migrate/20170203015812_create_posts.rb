ROM::SQL.migration do
  change do
    create_table :posts do
      primary_key :id
      column :title, String, null: false
      column :body_md, String, null: false
      column :updated_at, Time, null: false
      column :created_at, Time, null: false
    end
  end
end
