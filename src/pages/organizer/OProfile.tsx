import FormGenerator from "@/components/FormGenerator";
import ImageSection from "@/components/organizer/ImageSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { Separator } from "@/components/ui/separator";
import { useOrganizer } from "@/hooks/useOrganizer";
import { useUpdateImage } from "@/hooks/useUpdateImage";
import useUserStore from "@/store/user-store";

import {
  eventOrganiserDetails,
  eventOrganiserSupport,
  socialMediaFields,
} from "@/utils/formFields";
import { organizerProfileSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";

const OProfile = () => {
  const { user } = useUserStore();
  const { updateProfile, isGetting, isLoading } = useOrganizer();
  const [isWarning, setIsWarning] = useState(
    !user?.name || !user?.bio || !user?.email
  );
  const [avatar, setAvatar] = useState<string | File | undefined>(
    user?.thumbnailUrl || undefined
  );
  const [coverPhoto, setCoverPhoto] = useState<string | File | undefined>(
    user?.coverPhotoUrl || undefined
  );
  const { updateImage, isPending } = useUpdateImage();
  const form = useForm<z.infer<typeof organizerProfileSchema>>({
    resolver: zodResolver(organizerProfileSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      website: user?.websiteLink || "",
      telegram: user?.telegramLink || "",
      instagram: user?.instagramLink || "",
      facebook: user?.facebookLink || "",
      discord: user?.discordLink || "",
      x: user?.xLink || "",
    },
  });
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        bio: user.bio || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        website: user.websiteLink || "",
        telegram: user.telegramLink || "",
        instagram: user.instagramLink || "",
        facebook: user.facebookLink || "",
        discord: user.discordLink || "",
        x: user.xLink || "",
      });
      setAvatar(user.thumbnailUrl || undefined);
      setCoverPhoto(user.coverPhotoUrl || undefined);
    }
  }, [user, form]);

  useEffect(() => {
    setIsWarning(!user?.name || !user?.bio || !user?.email);
  }, [user]);

  function onSubmit(values: z.infer<typeof organizerProfileSchema>) {
    updateProfile({
      name: values.name || "",
      bio: values.bio || "",
      coverPhotoImage: coverPhoto,
      thumbnailImage: avatar,
      phoneNumber: values.phone || "",
      websiteLink: values.website || null,
      telegramLink: values.telegram || null,
      instagramLink: values.instagram || null,
      facebookLink: values.facebook || null,
      discordLink: values.discord || null,
      xLink: values.x || null,
    });
  }

  const handleChangeImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      if (type === "avatar") {
        updateImage({
          thumbnailUrl: file,
          role: user?.role,
          name: user?.name,
          bio: user?.bio || undefined,
        });
      } else {
        updateImage({
          coverPhotoUrl: file,
          role: user?.role,
          name: user?.name,
          bio: user?.bio || undefined,
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p
        className={`text-lg p-3 rounded-md border shadow text-slate-700 bg-white font-medium flex justify-center relative ${
          isWarning ? "block" : "hidden"
        }`}
      >
        You haven't completed all mandatory fields, some features will be
        limited
        <XIcon
          className="absolute top-1/2 right-0 cursor-pointer hover:opacity-60 -translate-x-1/2 -translate-y-1/2"
          onClick={() => setIsWarning(false)}
        />
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Event organiser details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {
                <FormGenerator
                  control={form.control}
                  fields={eventOrganiserDetails}
                  isGetting={isGetting}
                />
              }
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {
                <FormGenerator
                  control={form.control}
                  fields={eventOrganiserSupport}
                  isGetting={isGetting}
                />
              }
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Imagery</CardTitle>
              <CardDescription>
                This is a preview of how the images will appear on your seller
                profile page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageSection
                primaryLabel="Upload Cover Photo"
                primaryImage={user?.coverPhotoUrl}
                secondaryLabel="Upload Avatar"
                secondaryImage={user?.thumbnailUrl}
                handleChangeImage={handleChangeImage}
                isUpdating={isPending}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {
                <FormGenerator
                  control={form.control}
                  fields={socialMediaFields}
                  isGetting={isGetting}
                />
              }
            </CardContent>
          </Card>
          <Separator />
          <div className="flex items-center flex-col md:flex-row gap-4 sticky bottom-0 bg-white dark:bg-slate-900 z-50 p-4">
            <Button
              type="submit"
              className="w-full md:w-96"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Update Profile"}
            </Button>

            <Button
              type="button"
              className="w-full md:w-48"
              variant={"outline"}
              onClick={() => console.log("Cancel")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OProfile;
