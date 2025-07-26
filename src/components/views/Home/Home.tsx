import CourseSection from "./CourseSection";
import FeatureSection from "./FeatureSection";
import HeroSection from "./HeroSection";
import PartnerSection from "./PartnerSection";
import ReviewSection from "./ReviewSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <PartnerSection />
      <CourseSection />
      <ReviewSection />
    </>
  );
}
