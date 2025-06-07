import RequireLabel from "@/components/RequireLabel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEventFormStore } from "@/store/event-form";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

const PromotionScreen = () => {
  const { updateField, artists = [], description } = useEventFormStore();
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    clearErrors,
  } = useFormContext(); // Access form context

  // Sync Zustand store values to React Hook Form on component mount
  useEffect(() => {
    setValue("description", description);
    if (artists.length > 0) {
      artists.forEach((artist, index) => {
        setValue(`artists[${index}].name`, artist.name);
        setValue(`artists[${index}].walletAddress`, artist.walletAddress);
        setValue(`artists[${index}].class`, artist.class);
      });
    }
    // Trigger validation
    clearErrors();
  }, [artists, description, setValue, clearErrors]);

  const addArtist = () => {
    const newArtist = { name: "", walletAddress: "", class: "" };
    const updatedArtists = [...artists, newArtist];
    updateField("artists", updatedArtists);

    // Update React Hook Form
    setValue(`artists[${updatedArtists.length - 1}]`, newArtist);
  };

  const removeArtist = (index: number) => {
    const updatedArtists = [...artists];
    updatedArtists.splice(index, 1);
    updateField("artists", updatedArtists);

    // Update React Hook Form
    setValue("artists", updatedArtists);
    trigger("artists");
  };

  const updateArtistField = (
    index: number,
    field: keyof (typeof artists)[0],
    value: string
  ) => {
    const updatedArtists = [...artists];
    updatedArtists[index] = {
      ...updatedArtists[index],
      [field]: value,
    };
    updateField("artists", updatedArtists);

    // Update React Hook Form
    setValue(`artists[${index}].${field}`, value);
    trigger(`artists[${index}].${field}`);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    updateField("description", value);

    // Update React Hook Form and trigger validation
    setValue("description", value);
    trigger("description");
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-3 space-y-3 shadow">
        <RequireLabel label="Event Description" htmlFor="description" />
        <Textarea
          id="event-bio"
          className="w-full"
          defaultValue={description || ""}
          placeholder="Enter a short description of your event. This will be displayed on the event page."
          {...register("description", { required: true })}
          onChange={handleDescriptionChange}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message?.toString()}
          </span>
        )}
      </Card>
      <Card className="p-3 space-y-3 shadow">
        <div className="flex items-center justify-between sticky -top-12 bg-background p-3 border-b">
          <Label htmlFor="event-bio">
            {artists.length} Artist{artists.length !== 1 ? "s" : ""}
          </Label>
          <Button
            onClick={addArtist}
            className="bg-primary text-primary-foreground rounded-lg"
          >
            Add Artists
          </Button>
        </div>

        {artists.map((artist, index) => (
          <div key={index} className="flex items-center gap-4">
            <Card className="shadow border border-border w-full">
              <CardHeader>
                <CardTitle>Artist</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-4 gap-4">
                <div className="flex flex-col gap-4">
                  <RequireLabel
                    label="Artist Name"
                    htmlFor={`artist-name-${index}`}
                  />
                  <Input
                    id={`artist-name-${index}`}
                    defaultValue={artist.name || ""}
                    placeholder="Enter artist name"
                    {...register(`artists[${index}].name`, { required: true })}
                    onChange={(e) =>
                      updateArtistField(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <RequireLabel
                    label="Artist Class"
                    htmlFor={`artist-class-${index}`}
                  />
                  <Input
                    id={`artist-class-${index}`}
                    defaultValue={artist.class || ""}
                    {...register(`artists[${index}].class`, { required: true })}
                    onChange={(e) =>
                      updateArtistField(index, "class", e.target.value)
                    }
                    placeholder="Enter artist class"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <RequireLabel
                    label="Artist Wallet Address"
                    htmlFor={`artist-address-${index}`}
                  />
                  <Input
                    id={`artist-address-${index}`}
                    defaultValue={artist.walletAddress || ""}
                    {...register(`artists[${index}].walletAddress`, {
                      required: true,
                    })}
                    onChange={(e) =>
                      updateArtistField(index, "walletAddress", e.target.value)
                    }
                    placeholder="Enter artist wallet address"
                  />
                </div>
                <div className="grid place-items-center">
                  <Button
                    onClick={() => removeArtist(index)}
                    variant="destructive"
                    className="w-1/2"
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {errors.artists && (
          <span className="text-destructive text-sm">
            Please fill out all artist details
          </span>
        )}
      </Card>
    </div>
  );
};

export default PromotionScreen;
