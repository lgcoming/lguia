import { apiErrors } from "@/lib/api/http";
import { localeFromRequest } from "@/lib/api/locale";

/** Unknown API paths answer with the JSON error shape (SPEC-006), not the HTML 404 page. */
function notFound(request: Request) {
  return apiErrors.notFound(localeFromRequest(request));
}

export {
  notFound as DELETE,
  notFound as GET,
  notFound as PATCH,
  notFound as POST,
  notFound as PUT,
};
