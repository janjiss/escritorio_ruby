Sequel.migration do
  up do
    create_table(:posts) do
      primary_key :id
      String :title, null: false
      String :body_md, null: false
    end
  end

  down do
    drop_table(:posts)
  end
end
