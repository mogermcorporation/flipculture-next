export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  dateLabel: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
};

export const POSTS: JournalPost[] = [
  {
    slug: "rolex-sub-vs-datejust-vs-vintage-daytona",
    title: "Rolex Sub vs Datejust vs Vintage Daytona: What the BIN Board Is Actually Paying",
    excerpt:
      "How we separate complete watches from parts, and why Patek Nautilus, AP Royal Oak, and Richard Mille sit on the most-valuable wall.",
    tag: "Watch Floors",
    date: "2026-09-01",
    dateLabel: "September 2026",
    image: "/journal/rolex-submariner.jpg",
    imageAlt: "Steel Rolex Oyster Perpetual Air-King with a black dial on a red leather book",
    paragraphs: [
      "The BIN board does not pay for a crown. It pays for a complete watch: case, bracelet or strap, movement that winds or ticks, and a dial that matches the reference you think you are buying. Submariners, Datejusts, and vintage Daytonas all trade on that same rule, then diverge hard on condition and papers.",
      "A no-date Sub with honest lume and a tight bracelet still clears a Datejust of the same age because the sports line has a deeper bid. A Datejust with a jubilee, fluted bezel, and unpolished lugs is the daily driver floor — real money, but not grail money. Vintage Daytonas sit above both when the pusher fonts, pumping pinion, and case-back stamps line up. A franken Daytona with a redial is a parts bin, not a grail.",
      "Above Rolex, the most-valuable wall is still Patek Nautilus, AP Royal Oak, and Richard Mille. Those listings only belong next to a Sub if the set is complete and the price is a live BIN, not a fantasy ask. We keep quartz fashion pieces and smartwatches off this desk.",
      "Before you tap View Drop, match the reference on the listing to the case, then check bracelet stretch, bezel clicks, and whether the seller photographed the movement or case-back. Incomplete watches belong in parts, not on the grail rail."
    ]
  },
  {
    slug: "how-to-spot-fake-air-jordan-1-retros-in-2026",
    title: "How to Spot Fake Air Jordan 1 Retros in 2026: The Complete Legit Check Guide",
    excerpt:
      "Crucial details on leather texture, heel shape, hourglass silhouettes, and Wings logo embossing before you buy or flip high-value pairs.",
    tag: "Legit Check",
    date: "2026-08-20",
    dateLabel: "August 2026",
    image: "/journal/jordan-1-legit-check.jpg",
    imageAlt: "Pair of Air Jordan 1 Low sneakers in black, white, and orange worn against a city wall",
    paragraphs: [
      "2026 fakes are closer than they were five years ago, but they still lose the shape. Start with the silhouette from a side photo: a real Jordan 1 High holds an hourglass in the midfoot. Replicas puff the collar, flatten the heel, or thicken the foxing until the shoe looks like a wedge.",
      "Leather is the next tell. Retail tumbled leather on Chicago, Bred, and Royal retros has a fine pebble and a soft roll at the collar. Many reps use a plasticky tumble or a dead-flat cut that never creases at the vamp. Compare the toe box height and the swoosh placement against a known pair — the swoosh should sit in the mid-panel, not drift toward the laces.",
      "Wings logos are still where factories get lazy. The emboss should be crisp, even, and aligned with the collar stitch. Soft, smeared, or off-center wings are a pass. On the inside, check the tongue tag font, the heel tab stitch count, and whether the insole print matches the year on the box label.",
      "Do not buy from a single beauty shot. Ask for the hourglass, the heel cup, the Wings close-up, the size tag, and the box label. If the seller will not shoot those, treat the pair as unverified and leave it off the sneakers wall."
    ]
  },
  {
    slug: "sourcing-vintage-streetwear-grails",
    title: "Sourcing Vintage Streetwear & Grails: Thrift to Marketplace Blueprint",
    excerpt:
      "How to evaluate tag dates, single-stitch construction, and authentic wear when flipping 90s apparel and hype streetwear.",
    tag: "Sourcing Strategy",
    date: "2026-08-12",
    dateLabel: "August 2026",
    image: "/journal/vintage-streetwear.jpg",
    imageAlt: "Row of vintage sage green t-shirts hanging on wooden hangers",
    paragraphs: [
      "The streetwear wall is not a mall rack. We source tees, hoodies, and denim that already have a date, a factory, and a story — then we price the BIN against what that exact cut actually sold for last month.",
      "On 90s tees, start with construction. Single-stitch hems, a thick collar that still stands, and a tag that matches the decade beat a reprint every time. Screen cracks should follow the fold, not sit as a printed distress layer. If the graphic is too sharp and the cotton too light, it is a modern blank.",
      "Hoodies follow weight and print. A real heavyweight blank holds its shape at the cuff. Wash the armpits and the print edges in photos; replica puff prints flake in sheets, while vintage plastisol wears in islands. Denim stays grouped by brand on this site — True Religion, Evisu, Levi's, Diesel — because a stitch pattern is not interchangeable.",
      "Thrift first, then marketplace. Photograph the tag, the hem, the graphic, and a well-lit full front. List what you can prove. Hype names without construction notes do not belong on the grail rail."
    ]
  }
];

export function latestPosts(limit = 3): JournalPost[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
}

export function getPost(slug: string): JournalPost | undefined {
  return POSTS.find((post) => post.slug === slug);
}
