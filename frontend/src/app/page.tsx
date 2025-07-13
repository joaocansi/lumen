"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { CircularProgress } from "@heroui/progress";
import toast from "react-hot-toast";

import { Navbar } from "@/components/navbar";
import { Paginated, PhotoWithProfile } from "@/types";
import { getPhotos } from "@/actions/get-photos";
import { PhotoView } from "@/components/photo-view";
import { FollowSuggestion } from "@/components/follow-suggestion";

export default function Home() {
  const { ref, inView } = useInView();

  const [paginatedPhotosOffset, setPaginatedPhotosOffset] = useState(0);
  const [paginatedPhotos, setPaginatedPhotos] = useState<
    Paginated<PhotoWithProfile>
  >({
    data: [],
    total: 1,
  });

  async function retrieveMorePhotos() {
    const { error, response } = await getPhotos(paginatedPhotosOffset, 20);

    if (error || !response) {
      toast.error("Não foi possível realizar operação");
      return;
    }

    const { data, total } = response;
    setPaginatedPhotos((prev) => ({ data: [...prev.data, ...data], total }));

    if (paginatedPhotosOffset + data.length < total)
      setPaginatedPhotosOffset((prev) => prev + data.length);
  }

  // useEffect(() => {
  //   (async () => {
  //     await retrieveMorePhotos();
  //   })();
  // }, []);

  useEffect(() => {
    if (inView) retrieveMorePhotos();
  }, [inView]);

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto w-[90%] mt-5">
        <div className="flex gap-8">
          <div className="flex-1 max-w-2xl">
            <div className="flex flex-col gap-8">
              {paginatedPhotos.data.map((photo, index) => (
                <PhotoView key={`feed-photo-${index}`} photo={photo} />
              ))}
              {paginatedPhotos.data.length < paginatedPhotos.total && (
                <div ref={ref} className="flex justify-center my-4">
                  <CircularProgress aria-label="Loading..." />
                </div>
              )}
            </div>
          </div>

          <FollowSuggestion />
        </div>
      </main>
    </div>
  );
}
