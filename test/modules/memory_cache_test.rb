require_relative "../helper"

class MemoryCacheTest < EscritorioTest

  def test_singlton_instace
    [:get_or_set, :update_cache].each do |m|
      assert(Escritorio::Modules::MemoryCache.singleton_methods.include?(m), "missing method #{m}")
    end
  end

  def test_return_value_from_cache
    cache_value = "new config"

    Escritorio::Modules::MemoryCache.get_or_set(:config) do
      cache_value
    end

    result = Escritorio::Modules::MemoryCache.get_or_set(:config) do
      "other value"
    end

    assert_equal(cache_value, result)
  end

  def test_update_cache
    key   = "some_key"
    value = "some_value"

    Escritorio::Modules::MemoryCache.update_cache(key, value)
    result = Escritorio::Modules::MemoryCache.get_or_set(key) {}

    assert_equal(value, result)

  end
  def test_raise_error_if_no_block
    assert_raises(RuntimeError) { Escritorio::Modules::MemoryCache.get_or_set("key") }
  end
end
