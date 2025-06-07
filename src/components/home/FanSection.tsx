import { ConnectFan } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/utils/motion";
import { motion } from "framer-motion";
import { Link } from "react-router";
const FanSection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="flex flex-col items-center gap-4 py-4 md:flex-row-reverse md:justify-between md:py-16 border-b pb-8 text-white"
    >
      <motion.div
        variants={fadeIn}
        className="flex flex-col gap-4 md:gap-8 items-center md:h-full"
      >
        <motion.h3
          variants={fadeIn}
          className="text-3xl leading-tight text-center font-bold"
        >
          Connect with your fans
        </motion.h3>
        <motion.p
          variants={fadeIn}
          className="text-white font-semibold text-center md:text-left text-lg"
        >
          Your company helps artists and organiers form closer and more valuable
          relationships with fans.
        </motion.p>
        <motion.p
          variants={fadeIn}
          className="text-white text-center md:text-left"
        >
          Blockchain technology opens up the opportunity to generate tangible
          value in new ways for artists, event organisers and fans. Digital
          tickets can be supplemented with unique digital assets and
          experiences, creating unrivalled value for all involved.
        </motion.p>
        <motion.div
          variants={fadeIn}
          whileHover={{ scale: 1.05 }}
          className="hidden md:block"
        >
          <Button className="text-lg py-8 px-6 linear-gradient">
            <Link to="/signup">Are you an event organizer?</Link>
          </Button>
        </motion.div>
      </motion.div>
      <motion.img
        initial="rest"
        src={ConnectFan}
        alt=""
        className="object-cover h-[600px] rounded md:w-2/3"
        loading="lazy"
      />
      <motion.div
        variants={fadeIn}
        whileHover={{ scale: 1.05 }}
        className="md:hidden mt-4"
      >
        <Button className="text-lg py-8 px-6">
          <Link to="/signup">Are you an event organizer?</Link>
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default FanSection;
