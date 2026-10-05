/**
 * Renders a JSON-LD <script> tag safely.
 * Use in server components to inject structured data.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The data is author-controlled (built in src/lib/json-ld.ts),
      // so dangerouslySetInnerHTML is safe here. JSON.stringify is enough
      // to escape it (no HTML-injectable characters remain after stringify).
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}