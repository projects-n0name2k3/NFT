import { Card1 } from "@/assets/images";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useUpdateImage } from "@/hooks/useUpdateImage";
import { useUpdateName } from "@/hooks/useUpdateName";

import useUserStore from "@/store/user-store";

import { Loader, PenIcon } from "lucide-react";
import { useState } from "react";

import { Outlet, useLocation, useNavigate } from "react-router";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [name, setName] = useState(user?.name || "");
  const { updateImage, isPending } = useUpdateImage();
  const { updateName, isUpdating } = useUpdateName();

  const handleChangeImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "avatar") {
        updateImage({ thumbnailUrl: file, role: "user" });
      } else {
        updateImage({ coverPhotoUrl: file, role: "user" });
      }
    }
  };

  const handleChangeName = () => {
    updateName(name);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center md:items-start relative">
      <Label
        htmlFor="cover"
        className="relative w-full cursor-pointer"
        onClick={(e) => isPending && e.preventDefault()}
      >
        <div className="w-full absolute md:h-96">
          <img
            src={user?.coverPhotoUrl || Card1}
            alt=""
            className="w-full h-96 object-cover"
          />
          {isPending && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          )}
        </div>
        <Input
          type="file"
          onChange={(e) => handleChangeImage(e, "cover")}
          className="hidden"
          id="cover"
          accept="image/*"
          disabled={isPending}
        />
      </Label>
      <div className="flex flex-col items-center gap-4 md:gap-2 mt-28 md:mt-64 md:items-start">
        <Label
          htmlFor="avatar"
          className="size-64 md:size-40 rounded-full shadow-md grid place-items-center cursor-pointer hover:opacity-90 relative"
          onClick={(e) => isPending && e.preventDefault()}
        >
          <Avatar className="w-[90%] h-[90%]">
            <AvatarImage
              src={user?.thumbnailUrl || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
          {isPending && (
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
              <Loader className="animate-spin text-white" />
            </div>
          )}
          <Input
            type="file"
            onChange={(e) => handleChangeImage(e, "avatar")}
            className="hidden"
            id="avatar"
            accept="image/*"
            disabled={isPending}
          />
        </Label>
        <div className="flex flex-col items-center md:items-start gap-2">
          {!isEditing ? (
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-2xl text-gray-800 ">
                {isUpdating ? "Updating..." : user?.name}
              </h3>
              <PenIcon size={18} onClick={() => setIsEditing(true)} />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl text-gray-800 font-semibold"
              />
              <Button onClick={handleChangeName}>Save</Button>
            </div>
          )}
          <h3 className=" font-medium text-gray-800">{user?.walletAddress}</h3>
        </div>
      </div>
      <Separator className="mt-4 relative" />
      <div className="flex items-center gap-4 mt-4">
        <Button
          variant={pathname === "/profile" ? "default" : "outline"}
          onClick={() => navigate("/profile")}
        >
          Inventory
        </Button>
        <Button
          variant={pathname === "/profile/resaling" ? "default" : "outline"}
          onClick={() => navigate("/profile/resaling")}
        >
          Reselling Tickets
        </Button>
      </div>

      <Outlet />
    </div>
  );
};

export default Profile;
