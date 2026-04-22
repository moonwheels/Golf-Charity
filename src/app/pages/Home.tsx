import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Heart,
  TrendingUp,
  Users,
  Target,
  Trophy,
  Sparkles,
  ArrowRight,
  Play,
} from "lucide-react";
import { Logo } from "../components/Logo";

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Split-Screen Hero */}
      <section className="min-h-[100svh] relative">
        {/* Background with Overlay and Premium Effects */}
        <div
          className="absolute inset-0 overflow-hidden bg-[#0B3D2E] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/home-hero-bg.png')" }}
        >
          <div className="absolute inset-0 backdrop-blur-[5px] scale-[1.02]"></div>
          {/* Solid green overlay for thematic integration */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D2E]/54 via-[#145A41]/42 to-[#FFD95A]/14 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E]/76 via-[#0B3D2E]/16 to-[#145A41]/24"></div>
          <div className="absolute inset-0 bg-[#0B3D2E]/10"></div>

          {/* Yellow Shaded Blur / Sun Glow Effect */}
          <div className="absolute top-[10%] right-[-14%] w-[240px] h-[240px] sm:top-[14%] sm:right-[-6%] sm:w-[320px] sm:h-[320px] lg:top-[18%] lg:right-[10%] lg:w-[440px] lg:h-[440px] bg-[#FFD95A]/28 rounded-full blur-[90px] sm:blur-[110px] lg:blur-[120px] mix-blend-screen pointer-events-none transform translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute bottom-[-4%] left-[-18%] w-[320px] h-[320px] sm:bottom-[2%] sm:left-[-10%] sm:w-[460px] sm:h-[460px] lg:bottom-[8%] lg:left-[8%] lg:w-[680px] lg:h-[680px] bg-[#145A41]/30 rounded-full blur-[120px] sm:blur-[140px] lg:blur-[170px] mix-blend-screen pointer-events-none transform -translate-x-1/4 translate-y-1/4"></div>
        </div>

        {/* Content - positioned on top with higher z-index */}
        <motion.div
          className="relative z-10 px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28 md:px-10 md:pt-32 lg:px-20 lg:pt-36 xl:px-24 flex flex-col justify-start items-start text-left min-h-[100svh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl w-full flex flex-col items-start">
            <motion.h1
              className="max-w-[10ch] text-[2.95rem] sm:text-6xl md:text-7xl lg:text-[6.4rem] xl:text-[8.6rem] font-bold text-white mb-5 sm:mb-6 md:mb-8 leading-[0.96] tracking-tighter"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Play. Win. <br />
              <span className="relative inline-block text-[#FFDF3A]">
                Give Back.
              </span>
            </motion.h1>

            <motion.p
              className="text-[0.98rem] sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 lg:mb-12 max-w-xl md:max-w-2xl leading-relaxed font-medium"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Track your game, win rewards, and create real impact in
              communities around the world.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 w-full max-w-xl mb-10 sm:mb-12 sm:justify-start"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link to="/?auth=login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full min-h-[3.75rem] bg-[#FFDF3A] text-[#145A41] hover:bg-[#FFE866] font-bold text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-5 sm:py-6 transition-all transform hover:-translate-y-1 border border-[#FFE866]/70"
                >
                  Get Started{" "}
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Link to="/impact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full min-h-[3.75rem] text-white hover:bg-white/10 font-bold text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-5 sm:py-6 border-2 border-white/20 hover:border-white/40 transition-all backdrop-blur-sm"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-white/90 text-xs sm:text-sm md:text-base bg-white/5 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-full border border-white/10 shadow-lg justify-start w-full max-w-max"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <div className="flex -space-x-2">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1697448524689-8dfd3d11071e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBnb2xmZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1MjA3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Golfer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#145A41] object-cover"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1606208936025-d752d42c74ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdvbGZlciUyMHNtaWxpbmd8ZW58MXx8fHwxNzc0NTIwNzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Golfer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#145A41] object-cover"
                />
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-xl border-2 border-[#145A41] flex items-center justify-center">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold leading-tight">
                  Join the Movement
                </span>
                <span className="text-white/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                  Golfers Giving Back
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Premium Movement Strip */}
      <div className="relative overflow-hidden bg-[#0B3A2B] h-12 sm:h-14 md:h-16 flex items-center border-t border-white/[0.08]">
        {/* Gradient Fades for Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-[#0B3A2B] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-[#0B3A2B] to-transparent z-10 pointer-events-none"></div>

        <motion.div
          className="flex whitespace-nowrap w-max"
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* We duplicate the content to ensure a seamless loop. */}
          <div className="flex items-center text-[#F5F5F5] uppercase font-semibold text-[10px] sm:text-xs md:text-base tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.2em]">
            {[...Array(4)].map((_, i) => (
              <span key={`first-${i}`} className="flex items-center">
                <span className="mx-4 sm:mx-5 md:mx-8">PLAY WITH PURPOSE</span>
                <span className="text-[#FFD95A]/70 text-[10px] sm:text-xs md:text-sm">
                  ✦
                </span>
                <span className="mx-4 sm:mx-5 md:mx-8">WIN REAL REWARDS</span>
                <span className="text-[#FFD95A]/70 text-[10px] sm:text-xs md:text-sm">
                  ✦
                </span>
                <span className="mx-4 sm:mx-5 md:mx-8">
                  SUPPORT REAL CAUSES
                </span>
                <span className="text-[#FFD95A]/70 text-[10px] sm:text-xs md:text-sm">
                  ✦
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center text-[#F5F5F5] uppercase font-semibold text-[10px] sm:text-xs md:text-base tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.2em]">
            {[...Array(4)].map((_, i) => (
              <span key={`second-${i}`} className="flex items-center">
                <span className="mx-4 sm:mx-5 md:mx-8">PLAY WITH PURPOSE</span>
                <span className="text-[#FFD95A]/70 text-[10px] sm:text-xs md:text-sm">
                  ✦
                </span>
                <span className="mx-4 sm:mx-5 md:mx-8">WIN REAL REWARDS</span>
                <span className="text-[#FFD95A]/70 text-[10px] sm:text-xs md:text-sm">
                  ✦
                </span>
                <span className="mx-4 sm:mx-5 md:mx-8">
                  SUPPORT REAL CAUSES
                </span>
                <span className="text-[#FFD95A]/70 text-[10px] sm:text-xs md:text-sm">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#145A41] mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-xl text-gray-600">
              Three simple steps to make a difference
            </p>
          </motion.div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-3 lg:gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Enter Scores",
                description:
                  "Log your golf rounds and track your improvement over time. Connect with friends and join challenges.",
                color: "#FFD95A",
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Win Rewards",
                description:
                  "Compete monthly for prizes, merchandise, and golf experiences. The better you play, the more you win.",
                color: "#145A41",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Support Charity",
                description:
                  "Every subscription contributes to your chosen charity. See your impact grow with each game you play.",
                color: "#FFD95A",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: step.color }}
                >
                  <div style={{ color: index === 1 ? "#FFD95A" : "#145A41" }}>
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#145A41]">
                  {step.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section
        className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24 text-white"
        style={{
          background: "linear-gradient(135deg, #0B3D2E 0%, #145A41 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Real Impact, Real Change
            </h2>
            <p className="text-base sm:text-xl text-white/80">
              Together, we're making a difference
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 mb-14 sm:mb-16">
            {[
              { value: "$2.4M", label: "Donated to Charities" },
              { value: "15,000+", label: "Active Members" },
              { value: "250+", label: "Monthly Winners" },
              { value: "50+", label: "Partner Charities" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#FFD95A] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-lg text-white/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Featured Charities */}
          <div className="grid gap-5 sm:gap-6 md:grid-cols-3 lg:gap-8">
            {[
              {
                name: "Children's Education Fund",
                image:
                  "https://images.unsplash.com/photo-1771408427146-09be9a1d4535?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGNsYXNzcm9vbSUyMGxlYXJuaW5nJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3NDUyMDI0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                raised: "$450,000",
                impact: "15,000 children educated",
              },
              {
                name: "Healthcare for All",
                image:
                  "https://images.unsplash.com/photo-1722974180453-305758503804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMHZvbHVudGVlcnMlMjBoZWxwaW5nfGVufDF8fHx8MTc3NDUyMDI0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                raised: "$820,000",
                impact: "25,000 lives improved",
              },
              {
                name: "Community Food Program",
                image:
                  "https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBmb29kJTIwZG9uYXRpb24lMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc3NDUxMjA2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                raised: "$380,000",
                impact: "50,000 meals served",
              },
            ].map((charity, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={charity.image}
                    alt={charity.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    {charity.name}
                  </h3>
                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between text-[#FFD95A] font-semibold">
                    <span>{charity.raised}</span>
                    <span className="text-sm text-white/70">
                      {charity.impact}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
        style={{
          background: "linear-gradient(135deg, #FFD95A 0%, #F4C430 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#145A41] mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-base sm:text-xl text-[#145A41]/80 mb-8">
              Join thousands of golfers who are changing lives while improving
              their game.
            </p>
            <Link
              to="/pricing"
              className="inline-flex w-full justify-center sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold text-base sm:text-lg px-8 sm:px-12 py-5 sm:py-6 shadow-xl hover:shadow-2xl transition-all"
              >
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-white px-4 py-10 sm:px-6 sm:py-12"
        style={{
          background: "linear-gradient(135deg, #0B3D2E 0%, #145A41 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo className="w-12 h-12 text-[#FFD95A]" />
            <span className="font-bold text-2xl">GolfGive</span>
          </div>
          <p className="text-white/70 mb-4">
            Making the world better, one round at a time.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8 text-sm text-white/60">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
