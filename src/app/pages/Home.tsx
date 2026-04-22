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
          className="relative z-10 p-6 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center pt-24 md:pt-0">
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8 leading-tight tracking-tight drop-shadow-sm"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Play. <span className="text-[#FFD95A] relative inline-block">
                Win.
                <span className="absolute inset-0 bg-[#FFD95A] blur-2xl opacity-20 pointer-events-none"></span>
              </span> <br className="hidden sm:block" /> Give Back.
            </motion.h1>
            
            <motion.p
              className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-10 md:mb-12 max-w-3xl leading-relaxed font-medium"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Track your game, win rewards, and create real impact in communities around the world.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-12 justify-center w-full max-w-xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-[#FFD95A] text-[#145A41] hover:bg-[#F4C430] font-bold text-lg md:text-xl px-10 py-7 shadow-[0_8px_30px_rgba(255,217,90,0.25)] hover:shadow-[0_15px_40px_rgba(255,217,90,0.4)] transition-all transform hover:-translate-y-1">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/impact" className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full text-white hover:bg-white/10 font-bold text-lg md:text-xl px-10 py-7 border-2 border-white/20 hover:border-white/40 transition-all backdrop-blur-sm">
                  Learn More
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-4 text-white/90 text-sm md:text-base bg-white/5 backdrop-blur-md px-6 md:px-8 py-3 rounded-full border border-white/10 shadow-lg"
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
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1675106645743-1e47fd7206a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwZ29sZmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NTIwNzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Golfer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#145A41] object-cover"
                />
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-xl border-2 border-[#145A41] flex items-center justify-center">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              </div>
              <span className="font-semibold tracking-wide">Trusted by 10,000+ golfers worldwide</span>
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