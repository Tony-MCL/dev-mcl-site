export type ProductSlug = "husket" | "receipts";

type LinkConfig = {
  href: string;
  labelKey: string;
  external?: boolean;
  className?: string;
};

type HeroBlock = {
  type: "hero";
  id: string;
  className?: string;
  titleKey?: string;
  titleClassName?: string;
  taglineKey?: string;
  taglineClassName?: string;
  bodyKeys?: string[];
  lastBodyClassName?: string;
  cta?: LinkConfig;
};

type HeroSplitBlock = {
  type: "heroSplit";
  id: string;
  className: string;
  mediaWrapClassName: string;
  copyClassName: string;
  titleKey?: string;
  titleClassName?: string;
  taglineKey?: string;
  taglineClassName: string;
  bodyKeys?: string[];
  bodyClassName?: string;
  mediaDecorative?: boolean;
  image: {
    src: string;
    altKey?: string;
    className: string;
  };
  cta?: LinkConfig;
};

type ImageGridBlock = {
  type: "imageGrid";
  id: string;
  className: string;
  titleKey?: string;
  items: Array<{
    src: string;
    altKey: string;
    cardClassName: string;
    imageClassName: string;
  }>;
};

type FigureGridBlock = {
  type: "figureGrid";
  id: string;
  wrapperClassName?: string;
  className: string;
  titleKey?: string;
  items: Array<{
    src: string;
    altKey: string;
    captionKey: string;
    figureClassName: string;
    imageClassName: string;
    captionClassName: string;
  }>;
};

type BulletCardBlock = {
  type: "bulletCard";
  id: string;
  className?: string;
  bulletKeys: string[];
  strongBodyKeys?: string[];
};

type CardsGridBlock = {
  type: "cardsGrid";
  id: string;
  className: string;
  items: Array<{
    titleKey: string;
    bodyKeys: string[];
    cardClassName?: string;
    fullWidth?: boolean;
    removeTopMargin?: boolean;
    cta?: LinkConfig;
  }>;
};

type FlowColumnsBlock = {
  type: "flowColumns";
  id: string;
  className: string;
  columns: Array<{
    titleKey: string;
    blocks: Array<{
      titleKey: string;
      bodyKeys: string[];
    }>;
  }>;
};

type BottomCardsBlock = {
  type: "bottomCards";
  id: string;
  className: string;
  items: Array<{
    titleKey: string;
    bodyKeys: string[];
  }>;
};

type CtaBlock = {
  type: "cta";
  id: string;
  className: string;
  innerClassName: string;
  titleKey: string;
  subKey: string;
  subClassName?: string;
  button: LinkConfig;
  noteKey: string;
  noteClassName?: string;
};

export type ProductContentBlock =
  | HeroBlock
  | HeroSplitBlock
  | ImageGridBlock
  | FigureGridBlock
  | BulletCardBlock
  | CardsGridBlock
  | FlowColumnsBlock
  | BottomCardsBlock
  | CtaBlock;

export type ProductDefinition = {
  slug: ProductSlug;
  routePath: string;
  pageClassName: string;
  home: {
    titleKey: string;
    bodyKey: string;
    ctaKey: string;
    badgeKey?: string;
  };
  blocks: ProductContentBlock[];
};

export const PRODUCTS: ProductDefinition[] = [
  {
    slug: "husket",
    routePath: "/husket",
    pageClassName: "page husket-page",
    home: {
      titleKey: "home.cards.husket.title",
      bodyKey: "home.cards.husket.body",
      ctaKey: "home.cards.husket.cta",
      badgeKey: "home.cards.husket.badge",
    },
    blocks: [
      {
        type: "heroSplit",
        id: "hero",
        className: "husket-hero-layout",
        mediaWrapClassName: "husket-logo-wrap",
        copyClassName: "husket-hero-copy",
        taglineKey: "husket.hero.tagline",
        taglineClassName: "husket-hero-tagline",
        bodyKeys: ["husket.hero.intro"],
        bodyClassName: "husket-hero-intro",
        mediaDecorative: true,
        image: {
          src: "husketlogo.svg",
          className: "husket-logo-image",
        },
        cta: {
          href: "https://groups.google.com/g/husket-testpanel/about",
          external: true,
          className: "hero-cta",
          labelKey: "husket.next.cta",
        },
      },
      {
        type: "figureGrid",
        id: "glimpse",
        wrapperClassName: "intro-card",
        className: "husket-glimpse-grid",
        titleKey: "husket.glimpse.title",
        items: [
          {
            src: "husket-screen-1.png",
            altKey: "husket.glimpse.alt.one",
            captionKey: "husket.glimpse.caption.one",
            figureClassName: "husket-glimpse-card",
            imageClassName: "husket-glimpse-image",
            captionClassName: "husket-glimpse-caption",
          },
          {
            src: "husket-screen-2.png",
            altKey: "husket.glimpse.alt.two",
            captionKey: "husket.glimpse.caption.two",
            figureClassName: "husket-glimpse-card",
            imageClassName: "husket-glimpse-image",
            captionClassName: "husket-glimpse-caption",
          },
          {
            src: "husket-screen-3.png",
            altKey: "husket.glimpse.alt.three",
            captionKey: "husket.glimpse.caption.three",
            figureClassName: "husket-glimpse-card",
            imageClassName: "husket-glimpse-image",
            captionClassName: "husket-glimpse-caption",
          },
        ],
      },
      {
        type: "cardsGrid",
        id: "cards",
        className: "intro-grid two-columns",
        items: [
          {
            titleKey: "husket.cards.capture.title",
            bodyKeys: ["husket.cards.capture.body"],
          },
          {
            titleKey: "husket.cards.structure.title",
            bodyKeys: ["husket.cards.structure.body"],
          },
          {
            titleKey: "husket.cards.offline.title",
            bodyKeys: ["husket.cards.offline.body"],
          },
          {
            titleKey: "husket.cards.privacy.title",
            bodyKeys: ["husket.cards.privacy.body"],
          },
          {
            titleKey: "husket.next.title",
            bodyKeys: ["husket.next.body"],
            fullWidth: true,
            removeTopMargin: true,
            cta: {
              href: "https://groups.google.com/g/husket-testpanel/about",
              external: true,
              className: "hero-cta",
              labelKey: "husket.next.cta",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "receipts",
    routePath: "/receipts",
    pageClassName: "page receipt-page",
    home: {
      titleKey: "home.cards.receipts.title",
      bodyKey: "home.cards.receipts.body",
      ctaKey: "home.cards.receipts.cta",
      badgeKey: "home.cards.receipts.badge",
    },
    blocks: [
      {
        type: "hero",
        id: "hero",
        className: "fs-hero",
        titleKey: "receipt.hero.title",
        titleClassName: "hero-title",
        taglineKey: "receipt.hero.sub",
        taglineClassName: "hero-tagline",
        bodyKeys: ["receipt.hero.line"],
        lastBodyClassName: "hero-sub",
        cta: {
          href: "mailto:post@morningcoffeelabs.no?subject=Interest%20in%20receipt%20app",
          className: "hero-cta",
          labelKey: "receipt.cta.button",
        },
      },
      {
        type: "imageGrid",
        id: "visuals",
        className: "receipt-visual-grid",
        items: [
          {
            src: "receipt-before.png",
            altKey: "receipt.visual.before",
            cardClassName: "intro-card",
            imageClassName: "receipt-visual-image",
          },
          {
            src: "receipt-after.png",
            altKey: "receipt.visual.after",
            cardClassName: "intro-card",
            imageClassName: "receipt-visual-image",
          },
        ],
      },
      {
        type: "bulletCard",
        id: "problem",
        className: "intro-card",
        bulletKeys: [
          "receipt.problem.one",
          "receipt.problem.two",
          "receipt.problem.three",
          "receipt.problem.four",
          "receipt.problem.five",
        ],
        strongBodyKeys: ["receipt.problem.line1", "receipt.problem.line2"],
      },
      {
        type: "flowColumns",
        id: "flowTop",
        className: "receipt-flow-grid",
        columns: [
          {
            titleKey: "receipt.flow.save.title",
            blocks: [
              {
                titleKey: "receipt.flow.save.capture.title",
                bodyKeys: ["receipt.flow.save.capture.body"],
              },
              {
                titleKey: "receipt.flow.save.import.title",
                bodyKeys: ["receipt.flow.save.import.body"],
              },
            ],
          },
          {
            titleKey: "receipt.flow.store.title",
            blocks: [
              {
                titleKey: "receipt.flow.store.organized.title",
                bodyKeys: [
                  "receipt.flow.store.organized.body1",
                  "receipt.flow.store.organized.body2",
                ],
              },
              {
                titleKey: "receipt.flow.store.autofill.title",
                bodyKeys: ["receipt.flow.store.autofill.body"],
              },
            ],
          },
          {
            titleKey: "receipt.flow.use.title",
            blocks: [
              {
                titleKey: "receipt.flow.use.whenNeeded.title",
                bodyKeys: ["receipt.flow.use.whenNeeded.body"],
              },
              {
                titleKey: "receipt.flow.use.proof.title",
                bodyKeys: ["receipt.flow.use.proof.body"],
              },
              {
                titleKey: "receipt.flow.use.warranty.title",
                bodyKeys: ["receipt.flow.use.warranty.body"],
              },
            ],
          },
        ],
      },
      {
        type: "bottomCards",
        id: "flowBottom",
        className: "receipt-flow-bottom-grid",
        items: [
          {
            titleKey: "receipt.flow.bottom.safe.title",
            bodyKeys: ["receipt.flow.bottom.safe.body"],
          },
          {
            titleKey: "receipt.flow.bottom.product.title",
            bodyKeys: [
              "receipt.flow.bottom.product.body1",
              "receipt.flow.bottom.product.body2",
            ],
          },
          {
            titleKey: "receipt.flow.bottom.timing.title",
            bodyKeys: ["receipt.flow.bottom.timing.body"],
          },
        ],
      },
      {
        type: "cta",
        id: "cta",
        className: "receipt-cta receipt-cta-standalone",
        innerClassName: "receipt-cta-inner",
        titleKey: "receipt.cta.title",
        subKey: "receipt.cta.sub",
        subClassName: "receipt-cta-sub",
        button: {
          href: "mailto:post@morningcoffeelabs.no?subject=Interest%20in%20receipt%20app",
          labelKey: "receipt.cta.button",
          className: "hero-cta receipt-cta-button",
        },
        noteKey: "receipt.cta.note",
        noteClassName: "receipt-cta-note",
      },
    ],
  },
];

export function getProductBySlug(slug: ProductSlug) {
  return PRODUCTS.find((product) => product.slug === slug) ?? null;
}
