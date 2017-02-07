require "oj"
require "cuba"
require "sequel"
require 'dry-struct'
require "dry-container"
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
  Helpers     = Module.new
  Plugins     = Module.new
  Relations   = Module.new
  Models      = Module.new
  Repos       = Module.new
  Middlewares = Module.new

  Routes = Class.new(Cuba)
end

Oj.default_options = { symbol_keys: true, mode: :compat }

def require_files(path)
  Dir[path].sort.each { |rb| require rb }
end

require "routes"
require "helpers"
require "plugins"
require "relations"
require "repos"
require "models"
require "middlewares"

APP = Dry::Container.new

APP.register(:rom_config) { ROM::Configuration.new(:sql, DB_PATH) }
APP.resolve(:rom_config).register_relation(Escritorio::Relations::Posts)
APP.register(:rom) { ROM.container(APP.resolve(:rom_config)) }

APP.namespace('repos') do |namespace|
  namespace.register('posts') { Escritorio::Repos::Posts.new(APP.resolve(:rom)) }
end
