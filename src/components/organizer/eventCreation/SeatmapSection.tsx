import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";

interface SeatmapSectionProps {
  title: string;
  previewSeatmap: string | ArrayBuffer | File | undefined;
  uploadTitle: string;
  handleSeatmapUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SeatmapSection = ({
  title,
  previewSeatmap,
  uploadTitle,
  handleSeatmapUpload,
}: SeatmapSectionProps) => {
  return (
    <div className="h-auto lg:h-[800px] lg:sticky top-0">
      <Card className="h-full w-full shadow flex flex-col items-center mb-4 lg:mb-0">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="w-full overflow-auto flex items-center justify-center">
          {previewSeatmap ? (
            <Label
              htmlFor="seatmap-upload"
              className="cursor-pointer flex flex-col items-center w-full h-full"
            >
              <span className="text-sm text-muted-foreground">
                <img
                  src={
                    typeof previewSeatmap === "string"
                      ? previewSeatmap
                      : URL.createObjectURL(
                          new Blob([previewSeatmap as ArrayBuffer])
                        )
                  }
                  onClick={() => {}}
                  alt="Preview Seatmap"
                  className="max-w-full h-full"
                />
              </span>
            </Label>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center w-full h-64 hover:bg-gray-50 transition-colors">
              <Label
                htmlFor="seatmap-upload"
                className="cursor-pointer flex flex-col items-center w-full h-full"
              >
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Image />
                </div>
                <span className="text-sm text-muted-foreground">
                  {uploadTitle}
                </span>
              </Label>
            </div>
          )}
          <Input
            id="seatmap-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSeatmapUpload}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatmapSection;
