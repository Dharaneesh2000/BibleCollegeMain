import BiblicalFoundation from '/images/BiblicalFoundation.png';
import GlobalMissionFocus from '/images/GlobalMissionFocus.png';
import VibrantCommunity from '/images/vibrantCommunity.png';
import ExpertFaculty from '/images/ExpertFaculty.png';
import LazyImage from './LazyImage';

const WhyChooseUs = () => {
  const features = [
    {
      icon: BiblicalFoundation,
      title: "Biblical Foundation",
      description: "Grounded in God's inerrant Word, our curriculum equips believers with strong theological foundations for life, ministry, and mission.",
      color: "bg-orange-50"
    },
    {
      icon: GlobalMissionFocus,
      title: "Global Mission",
      description: "Shaped by God's inspired Word, our curriculum builds robust theology and a global mission mindset for impactful life and ministry.",
      color: "bg-[#E7F5E8]"
    },
    {
      icon: VibrantCommunity,
      title: "Vibrant Community",
      description: "Rooted in the Bible, our college fosters worship, mentorship, and mission, cultivating resilient leaders for church and world.",
      color: "bg-[#F0F5FF]"
    },
    {
      icon: ExpertFaculty,
      title: "Expert Faculty",
      description: "Seasoned pastors and theologians offering rigorous, Bible-grounded training with personal guidance that forms character and calling.",
      color: "bg-[#F8EDFF]"
    }
  ];

  return (
    <section className="py-16 bg-white" aria-labelledby="why-choose-us-heading">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Text content */}
          <div>
            <div className="w-[94px] h-[7px] bg-[#012659] mb-6"></div>
            <h2 id="why-choose-us-heading" className="text-[38px] font-[700] text-[#333333] leading-tight mb-6">
              Why GWBC your Choice?
            </h2>
            <p className="text-[18px] font-[400] text-[#333333] leading-relaxed">
              We believe that true education is more than knowledge—it is transformation. Rooted in Scripture and guided by the Holy Spirit, our mission is to equip men and women to live out God's calling with clarity, conviction, and compassion. At God's Will Bible College, you don't just earn a degree—you discover your purpose, deepen your faith, and prepare to fulfill God's will for your life.
            </p>
          </div>

          {/* Right side - Feature cards in 2x2 grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`${feature.color} p-6 rounded-[12px] shadow-sm`}
              >
                <div className="mb-4">
                  <LazyImage
                    src={feature.icon} 
                    alt={`${feature.title} - ${feature.description.substring(0, 50)}`}
                    className="w-16 h-16 object-contain"
                    width="64"
                    height="64"
                  />
                </div>
                <h3 className="text-[20px] font-[600] text-[#333333] mb-3 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-[14px] font-[400] text-[#636363] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
