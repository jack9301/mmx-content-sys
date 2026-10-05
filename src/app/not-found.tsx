import { redirect } from 'next/navigation';

/**
 * Root-level 404 fallback.
 *
 * When a request hits a path that doesn't match any locale (e.g. /not-a-real-path),
 * Next.js renders this. We redirect to the EN homepage, which then renders the
 * locale-aware not-found page when it can't match the requested resource.
 */
export default function RootNotFound() {
  redirect('/en');
}