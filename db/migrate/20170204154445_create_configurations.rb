ROM::SQL.migration do
  change do
    create_table :configurations do
      primary_key :id
      column :template, String, null: false
    end
  end
end
