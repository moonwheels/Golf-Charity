import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Heart, TrendingUp, Users, Target, Trophy, Sparkles, ArrowRight, Play } from "lucide-react";
import { Logo } from "../components/Logo";

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Split-Screen Hero */}
      <section className="min-h-screen relative">
        {/* Background Image with Overlay and Premium Effects */}
        <div className="absolute inset-0">
          {/* Solid green gradient background */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0B3D2E 0%, #145A41 100%)' }}></div>
          
          {/* Grain texture overlay for premium feel */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          ></div>
          
          {/* Subtle pattern overlay for depth - REFINED */}
          <div 
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              filter: 'blur(0.5px)',
            }}
          ></div>
        </div>

        {/* Content - positioned on top with higher z-index */}
        <motion.div
          className="relative z-10 p-6 md:p-12 lg:p-16 flex flex-col justify-center min-h-screen"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto w-full lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 mb-8 lg:mb-0">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 md:mb-8 leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Play. Win. Give Back.
              </motion.h1>
              <motion.p
                className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-8 md:mb-10 max-w-2xl leading-relaxed"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Track your game, win rewards, and create real impact in communities around the world.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-5 mb-8 md:mb-10"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <Link to="/auth">
                  <Button size="lg" className="bg-[#FFD95A] text-[#145A41] hover:bg-[#F4C430] font-bold text-lg md:text-xl px-8 md:px-10 py-6 md:py-7 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all">
                    Get Started <Play className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/impact">
                  <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 font-semibold text-lg md:text-xl px-8 md:px-10 py-6 md:py-7 w-full sm:w-auto border-2 border-white/30 hover:border-white/50">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 text-white/80 text-sm md:text-base"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <div className="flex -space-x-2">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1697448524689-8dfd3d11071e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBnb2xmZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1MjA3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Golfer"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1606208936025-d752d42c74ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdvbGZlciUyMHNtaWxpbmd8ZW58MXx8fHwxNzc0NTIwNzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Golfer"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1675106645743-1e47fd7206a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwZ29sZmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NTIwNzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Golfer"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="font-semibold">Trusted by 10,000+ golfers worldwide</span>
              </motion.div>
            </div>

            {/* Yellow Popup Card - Responsive */}
            <motion.div
              className="lg:col-span-5 p-6 md:p-8 rounded-[2rem] relative z-20 flex flex-col max-w-md mx-auto lg:mx-0 lg:ml-auto w-full"
              style={{
                background: 'linear-gradient(135deg, #FFD95A 0%, #F4C430 100%)',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.18)',
              }}
              initial={{ x: 100, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-1 flex flex-col justify-center">
                <motion.h2
                  className="text-3xl md:text-4xl font-extrabold text-[#145A41] mb-8 leading-tight tracking-tight"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Turn Your Game Into Impact
                </motion.h2>

                <div className="space-y-6">
                  {/* Subscribe Section - PRIMARY */}
                  <motion.div
                    className="group flex flex-col gap-5"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#0B3D2E] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Target className="w-7 h-7 text-[#FFD95A]" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-bold text-[#145A41] leading-none">
                            Subscribe Now
                          </h3>
                        </div>
                        <p className="text-base text-[#145A41]/80 font-medium mt-2">
                          Win real rewards every month 🎉
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-1">
                      <Link to="/pricing" className="block w-full">
                        <Button size="lg" className="bg-[#145A41] hover:bg-[#0B3D2E] text-white w-full font-bold text-lg py-6 rounded-xl shadow-[0_8px_30px_rgba(20,90,65,0.25)] hover:shadow-[0_15px_40px_rgba(20,90,65,0.4)] hover:-translate-y-1 transition-all duration-300">
                          Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Subtle Charity Message */}
                  <motion.div
                    className="pt-5 border-t border-[#145A41]/10 mt-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <p className="text-[14px] text-[#145A41]/75 font-medium text-center flex items-center justify-center gap-2">
                      <span className="text-red-500/90 text-base">❤️</span> Every game you play supports a real cause
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Premium Movement Strip */}
      <div className="relative overflow-hidden bg-[#0B3A2B] h-14 md:h-16 flex items-center border-t border-white/[0.08]">
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
          <div className="flex items-center text-[#F5F5F5] uppercase font-semibold text-sm md:text-base tracking-[0.2em]">
            {[...Array(4)].map((_, i) => (
              <span key={`first-${i}`} className="flex items-center">
                <span className="mx-6 md:mx-8">PLAY WITH PURPOSE</span>
                <span className="text-[#FFD95A]/70 text-xs md:text-sm">✦</span>
                <span className="mx-6 md:mx-8">WIN REAL REWARDS</span>
                <span className="text-[#FFD95A]/70 text-xs md:text-sm">✦</span>
                <span className="mx-6 md:mx-8">SUPPORT REAL CAUSES</span>
                <span className="text-[#FFD95A]/70 text-xs md:text-sm">✦</span>
              </span>
            ))}
          </div>
          <div className="flex items-center text-[#F5F5F5] uppercase font-semibold text-sm md:text-base tracking-[0.2em]">
            {[...Array(4)].map((_, i) => (
              <span key={`second-${i}`} className="flex items-center">
                <span className="mx-6 md:mx-8">PLAY WITH PURPOSE</span>
                <span className="text-[#FFD95A]/70 text-xs md:text-sm">✦</span>
                <span className="mx-6 md:mx-8">WIN REAL REWARDS</span>
                <span className="text-[#FFD95A]/70 text-xs md:text-sm">✦</span>
                <span className="mx-6 md:mx-8">SUPPORT REAL CAUSES</span>
                <span className="text-[#FFD95A]/70 text-xs md:text-sm">✦</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-[#145A41] mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to make a difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Enter Scores",
                description: "Log your golf rounds and track your improvement over time. Connect with friends and join challenges.",
                color: "#FFD95A",
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Win Rewards",
                description: "Compete monthly for prizes, merchandise, and golf experiences. The better you play, the more you win.",
                color: "#145A41",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Support Charity",
                description: "Every subscription contributes to your chosen charity. See your impact grow with each game you play.",
                color: "#FFD95A",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100"
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
                <h3 className="text-2xl font-bold mb-4 text-[#145A41]">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-24 px-6 text-white" style={{ background: 'linear-gradient(135deg, #0B3D2E 0%, #145A41 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Real Impact, Real Change
            </h2>
            <p className="text-xl text-white/80">
              Together, we're making a difference
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
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
                <div className="text-5xl md:text-6xl font-bold text-[#FFD95A] mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Featured Charities */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Children's Education Fund",
                image: "https://images.unsplash.com/photo-1771408427146-09be9a1d4535?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGNsYXNzcm9vbSUyMGxlYXJuaW5nJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3NDUyMDI0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                raised: "$450,000",
                impact: "15,000 children educated",
              },
              {
                name: "Healthcare for All",
                image: "https://images.unsplash.com/photo-1722974180453-305758503804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMHZvbHVudGVlcnMlMjBoZWxwaW5nfGVufDF8fHx8MTc3NDUyMDI0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                raised: "$820,000",
                impact: "25,000 lives improved",
              },
              {
                name: "Community Food Program",
                image: "https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBmb29kJTIwZG9uYXRpb24lMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc3NDUxMjA2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{charity.name}</h3>
                  <div className="flex justify-between items-center text-[#FFD95A] font-semibold">
                    <span>{charity.raised}</span>
                    <span className="text-sm text-white/70">{charity.impact}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #FFD95A 0%, #F4C430 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-[#145A41] mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-[#145A41]/80 mb-8">
              Join thousands of golfers who are changing lives while improving their game.
            </p>
            <Link to="/pricing">
              <Button size="lg" className="bg-[#145A41] hover:bg-[#0B3D2E] text-white font-bold text-lg px-12 py-6 shadow-xl hover:shadow-2xl transition-all">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12 px-6" style={{ background: 'linear-gradient(135deg, #0B3D2E 0%, #145A41 100%)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo className="w-12 h-12 text-[#FFD95A]" />
            <span className="font-bold text-2xl">GolfGive</span>
          </div>
          <p className="text-white/70 mb-4">
            Making the world better, one round at a time.
          </p>
          <div className="flex justify-center gap-8 text-sm text-white/60">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}