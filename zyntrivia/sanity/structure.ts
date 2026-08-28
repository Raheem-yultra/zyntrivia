import type { StructureResolver } from "sanity/structure";

/**
 * Pins "Homepage" as a single non-creatable, non-deletable entry (the
 * standard Sanity singleton pattern) instead of the default document list,
 * which would let an editor spawn a second homepage doc.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(
          S.document()
            .schemaType("homepage")
            .documentId("homepage")
            .title("Homepage"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "homepage",
      ),
    ]);
