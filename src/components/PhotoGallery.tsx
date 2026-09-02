import Image from "next/image";

type Photo = { id: string; url: string; alt: string };

export function PhotoGallery({ photos, name }: { photos: Photo[]; name: string }) {
  if (photos.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40">
        No photos yet
      </div>
    );
  }

  const [first, ...rest] = photos;

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl sm:aspect-auto sm:row-span-2">
        <Image
          src={first.url}
          alt={first.alt || name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {rest.slice(0, 4).map((p) => (
          <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={p.url}
              alt={p.alt || name}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
