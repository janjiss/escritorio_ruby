require "oj"
require "cuba"
require "sequel"
require 'dry-struct'
require "sqlite3"
require "rom"
require "rom-sql"
require "rom-repository"
require "redcarpet"

APP_DIR = Dir.pwd
WEBAPP_DIR = File.join(APP_DIR, "lib")
$LOAD_PATH.unshift(WEBAPP_DIR)

DB_PATH = File.join("sqlite://", "db", "escritorio")

module Types
  include Dry::Types.module
end

module Escritorio
  Helpers   = Module.new
  Plugins   = Module.new
  Relations = Module.new
  Models    = Module.new
  Repos     = Module.new

  Routes = Class.new(Cuba)
end

Oj.default_options = { symbol_keys: true, mode: :compat }

def require_files(path)
  Dir[path].sort.each { |rb| require rb }
end

[
  "routes",
  "routes",
  "helpers",
  "plugins",
  "relations",
  "repos",
  "models"
].map { |m| require m }


ROM_CONFIG = ROM::Configuration.new(:sql, DB_PATH)

[
  Escritorio::Relations::Posts,
  Escritorio::Relations::Configurations
].map { |relation|  ROM_CONFIG.register_relation(relation)}

ROM_CONTAINER = ROM.container(ROM_CONFIG)
