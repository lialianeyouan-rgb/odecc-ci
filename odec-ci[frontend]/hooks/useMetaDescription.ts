import { useEffect } from "react";

const META_DESCRIPTION_NAME = "description";

function ensureMetaTag(): HTMLMetaElement {
  let tag = document.querySelector(`meta[name="${META_DESCRIPTION_NAME}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", META_DESCRIPTION_NAME);
    document.head.appendChild(tag);
  }
  return tag as HTMLMetaElement;
}

export function useMetaDescription(description: string) {
  useEffect(() => {
    const tag = ensureMetaTag();
    tag.setAttribute("content", description);
  }, [description]);
}
