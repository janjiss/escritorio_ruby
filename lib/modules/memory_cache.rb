module Escritorio::Modules::MemoryCache
  CACHE = Concurrent::Map.new

  module_function

  def get_or_set(key, &block)
    raise RuntimeError, "No block given!" unless block_given?

    if CACHE.key?(key)
      CACHE.fetch(key)
    else
      CACHE[key] = block.call
    end
  end

  def update_cache(key, value)
    CACHE[key] = value
  end

  def delete_cache(key)
    CACHE.delete(key)
  end
end
