import showcaseData from "@/data/showcase.json";
import ShowcaseClient, { type ShowcaseItem } from "./Showcase.client";

export function Showcase() {
    const highlights = showcaseData as ShowcaseItem[];
    if (!highlights.length) {
        return null;
    }

    return <ShowcaseClient highlights={highlights} />;
}
