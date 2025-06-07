import { motion } from "framer-motion";
import { imageHover } from "@/utils/motion";
import { ImageCardProps } from "@/common/type";
const ImageCard = ({ image, classname }: ImageCardProps) => {
  return (
    <motion.img
      variants={imageHover}
      whileHover="hover"
      initial="rest"
      src={image}
      className={classname}
    />
  );
};

export default ImageCard;
