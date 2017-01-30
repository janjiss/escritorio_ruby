module Escritorio::Helpers
  module Responses
    STATUS_ACCEPTED              = 202
    STATUS_NO_CONTENT            = 204
    STATUS_BAD_REQUEST           = 400
    STATUS_NOT_FOUND             = 404
    STATUS_CONFLICT              = 409
    STATUS_UNPROCESSABLE_ENTITY  = 422
    STATUS_INTERNAL_SERVER_ERROR = 500

    module API
      def json(value)
        res.headers["Content-Type"] = "application/json; charset=UTF-8"
        res.write Oj.dump(value)
      end

      def accepted!(message = "Accepted", location)
        res.status = STATUS_ACCEPTED
        res.headers["Location"] = location

        json(message: message)

        halt res.finish
      end

      def no_content!
        res.status = STATUS_NO_CONTENT

        halt res.finish
      end

      def error!(status = STATUS_INTERNAL_SERVER_ERROR, body = {})
        res.status = status

        json(body)

        halt res.finish
      end

      def bad_request!(message = "Bad Request")
        error!(STATUS_BAD_REQUEST, message: message)
      end

      def conflict!(message = "Conflict")
        error!(STATUS_CONFLICT, message: message)
      end

      def not_found!(message = "Not Found")
        error!(STATUS_NOT_FOUND, message: message)
      end

      def unprocessable!(message = "Validation Failed", errors)
        error!(STATUS_UNPROCESSABLE_ENTITY, message: message, errors: errors)
      end
    end
  end
end
