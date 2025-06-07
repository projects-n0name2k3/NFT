import { Card1, Card2, Card3 } from "@/assets/images";
import ImageCard from "@/components/home/ImageCard";
import { fadeIn, staggerContainer } from "@/utils/motion";
import { motion } from "framer-motion";
import bg from "../../../public/home-bg.png";
interface HeroSectionProps {
  title: string;
  description: string;
}

const HeroSection = ({ title, description }: HeroSectionProps) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="flex items-center justify-center h-screen flex-col md:flex-row md:justify-between md:px-24 text-white"
    >
      <img src={bg} alt="" className="absolute z-0 left-0 top-0 w-full" />
      <motion.div variants={fadeIn} className="space-y-4 z-10">
        <motion.h1
          variants={fadeIn}
          className="text-[48px] md:text-[60px] md:w-80 md:text-left leading-tight font-bold text-center"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={fadeIn}
          className="text-white md:w-96 text-center md:text-left"
        >
          {description}
        </motion.p>
      </motion.div>
      <motion.div
        variants={staggerContainer}
        className="flex items-center relative md:gap-8 gap-4 mt-16  z-10"
      >
        <ImageCard
          image={Card1}
          classname="md:w-56 md:h-[400px] rounded w-40 h-72 mb-32 object-cover"
        />
        <ImageCard
          image={Card2}
          classname="md:w-56 md:h-[400px] rounded w-40 h-72 mb-16 object-cover "
        />

        <ImageCard
          image={Card3}
          classname="md:w-56 md:h-[400px] rounded w-32 h-64 mb-18 object-cover hidden md:block"
        />
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
