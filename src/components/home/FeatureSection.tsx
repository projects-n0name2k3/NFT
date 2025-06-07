import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/utils/motion";

import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/home/FeatureCard";
import { CardProps } from "@/common/type";

interface FeatureSectionProps {
  title: string;
  description: string;
  cards: CardProps[];
}

const FeatureSection = ({ title, description, cards }: FeatureSectionProps) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="flex flex-col items-center gap-8 py-4 md:py-16 text-white"
    >
      <motion.div
        variants={fadeIn}
        className="flex flex-col items-center gap-4"
      >
        <motion.h3
          variants={fadeIn}
          className="text-3xl leading-tight text-center font-bold md:w-1/2"
        >
          {title}
        </motion.h3>
        <motion.p variants={fadeIn} className=" text-center">
          {description}
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        className="flex flex-col md:flex-row items-center gap-4 md:gap-12 px-4"
      >
        {cards.map((card, index) => (
          <FeatureCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </motion.div>
      <motion.div variants={fadeIn} whileHover={{ scale: 1.05 }}>
        <Button className="text-xl py-8 px-6 linear-gradient">
          Start Selling Today
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default FeatureSection;
