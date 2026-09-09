# Cultural attribution policy

Amazonian visual traditions belong to living peoples. This archive documents inspiration; it does not
claim ownership of any cultural tradition, and it will not launder a specific tradition into
"generic tropical".

## Mandatory declarations

Every asset's `meta.json` declares:

| Field | Requirement |
| --- | --- |
| `origin.country` | ISO 3166-1 alpha-2, or `pan`. Never guessed. |
| `origin.region` | Named region, river basin or province. |
| `origin.cultural_reference` | The specific tradition, or `null` if the motif is purely botanical/faunal. Never "tribal", "ethnic" or "indigenous-style". |
| `origin.custodian_consent` | `not-applicable` \| `documented` \| `pending` |
| `origin.inspiration_notes` | How the work was researched or observed. |

## Consent states

- **`not-applicable`** — the motif derives from flora, fauna or landscape, with no identifiable
  community-held visual language.
- **`documented`** — the contributor has permission, a collaboration, or a commissioned relationship.
  The pull request must include a note or link describing it. The website displays a custodianship
  credit on the asset card.
- **`pending`** — a conversation with the community is in progress. The asset may be merged but is
  labelled on the site and should not be used commercially until resolved.

## Restricted imagery

Do not submit ceremonial, funerary, initiatory or otherwise restricted imagery. If you are unsure
whether a motif is restricted, **open a discussion issue before drawing it**. "I found it in a book" is
not evidence that a motif is unrestricted.

## Delisting

If a community or a credible representative raises a concern, the design council may delist an asset
from the showcase site while the question is open. Delisting removes it from distribution and from the
site index; it does not rewrite repository history. Resolution is documented in
[`CHANGELOG.md`](../CHANGELOG.md).

## Naming motifs

Keep the original-language motif name — `kené`, `vitória-régia`, `achiote`, `chambira`. Add a
translated gloss in the localized catalog where it helps comprehension. Never replace an Indigenous
term with a generic English one in the identifier.
