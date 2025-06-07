import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/utils/motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface ExploreSectionProps {
  title: string;
  label: string;
  href: string;
}

const ExploreSection = ({ title, label, href }: ExploreSectionProps) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="flex flex-col items-center gap-8 py-12 md:flex-row md:justify-between md:py-16 border-t text-white"
    >
      <motion.h3
        variants={fadeIn}
        className="text-4xl leading-tight text-center font-bold"
      >
        {title}
      </motion.h3>
      <motion.div variants={fadeIn} whileHover={{ scale: 1.05 }}>
        <Button className="text-lg py-8 px-6 md:p-8 linear-gradient">
          <Link to={href}>{label}</Link>
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default ExploreSection;
