import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface FilterButtonProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  items?: { label: string; value: string }[];
  onItemClick?: (item: { label: string; value: string }) => void;
  children?: React.ReactNode;
  setIsShowFilter?: (value: boolean) => void;
  isShowFilter?: boolean;
}

const FilterButton = ({
  title,
  description,
  icon,
  setIsOpen,
  isOpen,
  items,
  onItemClick,
  children,
  setIsShowFilter,
  isShowFilter,
}: FilterButtonProps) => {
  return (
    <>
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => setIsOpen(true)}
        className="flex-shrink-0 md:hidden"
      >
        {icon}
      </Button>
      {setIsShowFilter && (
        <Button
          size={"icon"}
          variant={"outline"}
          className="hidden md:flex flex-shrink-0"
          onClick={() => {
            setIsShowFilter(!isShowFilter);
          }}
        >
          {icon}
        </Button>
      )}
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
            {items && (
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <Button
                    key={item.value}
                    className="w-full justify-normal text-lg"
                    variant="ghost"
                    onClick={() => {
                      if (onItemClick)
                        onItemClick({
                          label: item.label,
                          value: item.value,
                        });
                      setIsOpen(false);
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            )}
            {children}
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FilterButton;
