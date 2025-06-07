import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, Loader } from "lucide-react";
import React from "react";

interface ImageSectionProps {
  primaryLabel: string;
  secondaryLabel: string;
  primaryImage: string | ArrayBuffer | null | undefined | File;
  secondaryImage: string | ArrayBuffer | null | undefined | File;
  handleChangeImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
  isUpdating?: boolean;
}

const ImageSection = ({
  primaryLabel,
  secondaryLabel,
  primaryImage,
  secondaryImage,
  handleChangeImage,
  isUpdating,
}: ImageSectionProps) => {
  return (
    <div
      className="outline-none border border-dashed rounded bg-dark-grey overflow-hidden relative text-white box-content w-full"
      style={{
        aspectRatio: "3.5/1",
      }}
    >
      <Label
        htmlFor="cover"
        className={`cursor-pointer group block h-full ${
          isUpdating ? "pointer-events-none" : ""
        }`}
      >
        <img
          src={
            typeof primaryImage === "string" && primaryImage.length > 0
              ? primaryImage
              : "https://images.seatlabnft.com/seller_cover_photos/default.jpg"
          }
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="flex flex-col gap-2 md:gap-4 items-center justify-center absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
          <Image className="opacity-0 group-hover:opacity-100 transition-all duration-300 w-5 h-5 md:w-6 md:h-6" />
          <p className="text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 px-2 text-center">
            {primaryLabel}
          </p>
        </div>
        {isUpdating && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader className="animate-spin w-6 h-6" />
          </div>
        )}
        <Input
          type="file"
          onChange={(e) => handleChangeImage(e, "cover")}
          className="hidden"
          id="cover"
          accept="image/*"
          disabled={isUpdating}
        />
      </Label>

      <Label
        htmlFor="avatar"
        className={`absolute bottom-4 sm:bottom-auto sm:left-6 md:left-10 lg:left-20 
                    sm:top-1/2 sm:-translate-y-1/2 
                    w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48
                    z-20 cursor-pointer transition-all
                    ${isUpdating ? "pointer-events-none" : ""}`}
      >
        <div className="outline-none border border-dashed rounded bg-dark-grey w-full h-full overflow-hidden relative text-white group">
          <img
            src={
              typeof secondaryImage === "string" && secondaryImage.length > 0
                ? secondaryImage
                : "https://images.seatlabnft.com/seller_cover_photos/default.jpg"
            }
            alt="Avatar"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="flex flex-col gap-2 md:gap-3 items-center justify-center absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
            <Image className="opacity-0 group-hover:opacity-100 transition-all duration-300 w-4 h-4 md:w-5 md:h-5" />
            <p className="text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 px-2 text-center">
              {secondaryLabel}
            </p>
          </div>
          {isUpdating && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader className="animate-spin w-5 h-5" />
            </div>
          )}
        </div>
        <Input
          type="file"
          onChange={(e) => handleChangeImage(e, "avatar")}
          className="hidden"
          id="avatar"
          accept="image/*"
          disabled={isUpdating}
        />
      </Label>
    </div>
  );
};

export default ImageSection;
