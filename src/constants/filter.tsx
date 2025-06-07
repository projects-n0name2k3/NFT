import { Grid2X2, LayoutList, LayoutPanelLeft } from "lucide-react";

const sortList = [
  // {
  //   label: "Price: Low to High",
  //   value: "asc",
  // },
  // {
  //   label: "Price: High to Low",
  //   value: "desc",
  // },
  // {
  //   label: "Recently Added",
  //   value: "newest",
  // },
  {
    label: "Recently Added",
    value: "desc",
  },
  {
    label: "Oldest",
    value: "asc",
  },
];

const viewList = [
  {
    label: "Grid",
    value: "grid",
    icon: <Grid2X2 />,
  },
  {
    label: "Gallery",
    value: "gallery",
    icon: <LayoutPanelLeft />,
  },
  {
    label: "List",
    value: "list",
    icon: <LayoutList />,
  },
];

export { viewList, sortList };
