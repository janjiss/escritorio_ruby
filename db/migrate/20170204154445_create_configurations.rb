ROM::SQL.migration do
  change do
    create_table :configurations do
      primary_key :id
      column :template, String, null: false
      column :updated_at, Time, null: false
      column :created_at, Time, null: false
    end
  end
end
