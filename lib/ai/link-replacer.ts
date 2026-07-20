import { ManagedLink } from "@/types";
import { initialManagedLinks } from "@/lib/store/mock-data";

export function replaceLinkVariables(
  text: string,
  managedLinks: ManagedLink[] = initialManagedLinks
): string {
  let result = text;
  for (const link of managedLinks) {
    if (link.key && link.url) {
      const regex = new RegExp(link.key.replace(/[{}]/g, "\\$&"), "g");
      result = result.replace(regex, link.url);
    }
  }
  return result;
}
