declare module "@/data/listings.json" {
  import type { ListingRow } from "@/lib/types";
  const value: { items: ListingRow[]; count: number };
  export default value;
}

declare module "@/data/items_genz.json" {
  import type { CohortRow } from "@/lib/types";
  const value: CohortRow[];
  export default value;
}

declare module "@/data/items_millennial.json" {
  import type { CohortRow } from "@/lib/types";
  const value: CohortRow[];
  export default value;
}

declare module "@/data/items_og.json" {
  import type { CohortRow } from "@/lib/types";
  const value: CohortRow[];
  export default value;
}
