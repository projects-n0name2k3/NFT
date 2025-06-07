import { CardProps } from "@/common/type";
import { featureCardVariants } from "@/utils/motion";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description }: CardProps) => {
  return (
    <motion.div
      variants={featureCardVariants}
      whileHover="hover"
      className="flex flex-col items-center gap-4 border p-8 md:h-96  rounded "
    >
      <motion.span
        whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
        className="bg-gray-200 p-4 rounded linear-gradient"
      >
        {icon}
      </motion.span>
      <h4 className="font-semibold text-xl">{title}</h4>
      <p className="text-center">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
