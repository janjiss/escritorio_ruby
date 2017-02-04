module ContentFixtures

  module_function

  def content_1
    <<~CONTENT
      ![Dependency injection](/content/images/2015/Jun/download.png)
      If you use dependency injection as a default get-go tool, you might get intimidated by the fact that you need to construct dependencies each time you want to call a given class. 
      Let me pick apart an example, where you need to receive an input, parse it and send it to a certain third party provider:


      ```ruby
      class Notifier
          def initialize(input, parser, gateway)
              @input = input
              @parser = parser
              @gateway = gateway
          end
          
          def call
              parsed_input = parser.parse(input)
              gateway.call(parsed_input)
          end
          
          attr_reader :parser, :gateway
      end
      ```


      Now, if we do it like this, obviously the construction of this class would look like so:

      ```ruby
      parser = Parser.new
      gateway = Gateway.new
      input = "SOME INPUT FORM WHATEVER"

      Notifier.new(input, parser, gateway).call
      ```

      If you have to deal with something like rails, there is a big chance that you want to keep your controllers free of all this code. Let me present you with some techniques I use to deal with this issues.

      ## .build method
      One of the simplest ways to solve this is to define a simple build method that defines the defaults. It's actually pretty straight forwards, so let's dig into the code:
      ```ruby
      class Notifier

          class << self
              def build(input)
                  new(
                      input,
                      Parser.new,
                      Gateway.new
                  )
              end
          end
          
          def initialize(input, parser, gateway)
              @input = input
              @parser = parser
              @gateway = gateway
          end
          
          def call
              parsed_input = parser.parse(input)
              gateway.call(parsed_input)
          end
          
          attr_reader :parser, :gateway, :input
      end
      ```

      In this example, we are simply assigning all of our dependencies in build method. This is quite an okayish solution, but it requires for us to have yet another method and I want to avoid writing the code as much as possible. I use .build method whenever I need to do some additional work on arguments, before passing them to the constructor. 

      We have achieved a cleaner interface of the notifier class:

      ```ruby
      input = "SOME INPUT FORM WHATEVER"

      Notifier.build(input).call
      ```

      I think it is quite nice and acceptable. 

      ## Using default arguments
      This method is more straightforward than the previous one. If I use this approach, I heavily leverage the keyword arguments for Ruby 2. 

      ```ruby
      class Notifier
          def initialize(input:, parser: Parser.new, gateway: Gateway.new)
              @input = input
              @parser = parser
              @gateway = gateway
          end
          
          def call
              parsed_input = parser.parse(input)
              gateway.call(parsed_input)
          end
          
          attr_reader :parser, :gateway, :input
      end
      ```

      This approach eliminates the need for a class method and gives us much more tidy class. One side note here is the fact that the initialize method argument list tends to get long if you have namespaced class names. If you are okay with that (I am), then use this method.

      With this approach we achieved the following result:

      ```ruby
      input = "SOME INPUT FORM WHATEVER"

      Notifier.new(input: input).call
      ```

      ## Why is this good?

      I write code and I do it a lot. I want my codebase to be maintainable and testable. First of all, dependency injection just eliminates the need for calling "real" objects. Let's imagine, that sending a message to the gateway is quite expensive HTTP call. If you want to mock it, it's quite simple to do and pass the double as a dependency.

      ```ruby
      describe Notifier do
          it "sends a message to a gateway" do
              gateway = instance_double(Gateway)
              expect(gateway).to receive(:call)
              input = "My random input again"
              Notifier.new(input: input, gateway: gateway)
          end
      end
      ```

      I really like the new interface checking capabilities of spec doubles. They validate that an instance of a particular class can receive a message and it saves a lot of troubles with outdated doubles. 

      Usually at the end of each test, I will have an integration test, that touches the whole chain of dependencies, otherwise mocking is not safe, even with the interface checking that RSpec provides.

      As a side note, it is generally a good idea to mock only the things you own. If it's a third party library, create a wrapper around it, that has an interface acceptable to you.

      In "the real world" code tends to get little more complex than the examples above, but with the little bit of imagination, it is pretty easy to figure that stuff out. 

      Some of these ideas are taken from Sandi Metz's book ["POODR"](http://www.poodr.com/). I can't recommend it enough. 

      Happy injecting!
    CONTENT
  end

  def content_2
    <<~CONTENT
      The reason behind this blog post is pretty simple - I wanted to pick apart some of the goodies of [Enumerable](http://ruby-doc.org/core-2.1.5/Enumerable.html#method-i-entries) module and have a reference for people who use `#each` all the time in their code.

      ## Let's partition
      When you need to split collection in two parts, there is a `#partition` method for that. Let's say we want to partition our collection of animals and humans in two parts. What parts you will ask? Humans and animals of course:

      ```ruby
      class Animal
              def is_animal?
              true
          end
      end
      class Human
              def is_animal?
              false
          end
      end


      [Animal.new, Animal.new, Human.new, Human.new, Animal.new].partition { |c| c.is_animal? }

      #=> [[#<Animal:0x007fb019830d08>, #<Animal:0x007fb019830ce0>, #<Animal:0x007fb019830bf0>], [#<Human:0x007fb019830c68>, #<Human:0x007fb019830c18>]]
      ```

      Cool, we have a collection of animals and collection of humans! That sounded weird, but that's ok - It's Ruby. Let's move on to next enumerator.

      ## Each with object you say?
      Let's say we want to iterate a collection, but we want to drag single object with us inside of block. In our case we will have a `Person` instance and it will have 
      a `#greet` method. (How classic). So the greeter will be a string that will be passed along for each element of collection. Enough words, let's see example:

      ```
      class Person
              def initialize(name)
              @name = name
          end
              def greet(greeter)
              puts "\#{greeter} \#{@name}"
          end
      end
      [Person.new("Peter"), Person.new("Meg"), Person.new("Louis")].each_with_object("Hello") { |i, a|  i.greet(a)} #=>
      # Hello Peter
      # Hello Meg
      # Hello Louis
      ```

      ## Finding maximal price

      Okay, we have a list of products and we need to return the priciest product we have. This method will make our sales team happy.

      ```ruby
      class Product
              def initialize(price)
              @price = price
          end
              attr_reader :price
      end
      [Product.new(100), Product.new(120), Product.new(1000)].max_by(&:price)
      => #<Product:0x007fb019861228 @price=1000>
      ```

      Sometimes I am so glad that computer does all the heavy lifting for me :)

      ## What about lowest and highest price?
      Same stuff. A sales guy comes to you and says - We need to find product with a lowest and highest price. No problemo. It's simple to do in Ruby:

      ```
      class Product
              def initialize(price)
              @price = price
          end
              attr_reader :price
      end
      [Product.new(100), Product.new(120), Product.new(1000)].minmax_by(&:price)
      => [#<Product:0x007fb01887a418 @price=100>, #<Product:0x007fb01887a3c8 @price=1000>]
      ```

      First element of returned array will be the product with smallest price and second element will be with highest. 

      ## Take while we can!

      Let's play cops and robbers. We want to create a list of people that we want to rob. Our goal is to stop when we stumble upon a cop. Then we decide that it will be enough and go underground to create our evil plan. Let's do it with help of Ruby!

      ```
      class Person
              def can_be_robbed?
              true
          end
      end
      class Cop
              def can_be_robbed?
              false
          end
      end

      [Person.new, Person.new, Cop.new, Person.new].take_while(&:can_be_robbed?)

      => [#<Person:0x007fa21a848848>, #<Person:0x007fa21a848820>]
      ```

      Only two people? Meh, not worth it. Let's figure out something else.

      ## Conclusion
      I hope you found this blog post interesting or at least funny. [Enumerable](http://ruby-doc.org/core-2.1.5/Enumerable.html#method-i-entries) has a ton of methods that can very useful, so I suggest you take a look at it and you might find what you need.
    CONTENT
  end
end
