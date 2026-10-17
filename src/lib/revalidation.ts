import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Revalidates the public site for all supported locales.
 */
export function revalidatePublicSite() {
  revalidatePath('/en', 'layout');
  revalidatePath('/km', 'layout');
}

/**
 * Revalidates a specific page across English and Khmer paths.
 * @param page - Relative page slug, e.g. "menu", "wholesale", "cafe", "promotions", "contact"
 */
export function revalidatePage(page: string) {
  const cleanPage = page.replace(/^\//, '');
  revalidatePath(`/en/${cleanPage}`);
  revalidatePath(`/km/${cleanPage}`);
}

/**
 * Revalidates home pages for all supported locales.
 */
export function revalidateHome() {
  revalidatePath('/en');
  revalidatePath('/km');
}

/**
 * Revalidates by cache tag.
 * @param tag - Cache tag to invalidate
 */
export function revalidateByTag(tag: string) {
  revalidateTag(tag, 'default');
}
