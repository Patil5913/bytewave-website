
export const ALL_CONTENT_TAG = "content:all";

export const tagFor = (slug: string) => `content:${slug}`;

export async function safeRevalidate(...tags: string[]): Promise<void> {
  try {
    const { revalidateTag } = await import("next/cache");
    for (const tag of tags) {
      
      revalidateTag(tag, { expire: 0 });
    }
  } catch (err) {
    console.warn(
      `[revalidate] skipped ${tags.join(", ")}: ${(err as Error).message}`,
    );
  }
}

export const revalidateHooks = (slug: string) => ({
  afterChange: [() => safeRevalidate(tagFor(slug), ALL_CONTENT_TAG)],
  afterDelete: [() => safeRevalidate(tagFor(slug), ALL_CONTENT_TAG)],
});

export const revalidateGlobalHooks = (slug: string) => ({
  afterChange: [() => safeRevalidate(tagFor(slug), ALL_CONTENT_TAG)],
});
