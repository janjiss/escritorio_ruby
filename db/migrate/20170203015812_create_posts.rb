ROM::SQL.migration do
  change do
    create_table :posts do
      primary_key :id
      column :title, String, null: false
      column :raw, String, null: false
      column :body, String, null: false
      column :updated_at, Time, null: false
      column :created_at, Time, null: false
    end
  end
end
