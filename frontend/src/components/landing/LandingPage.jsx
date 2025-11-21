import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiWifi, FiUsers, FiMessageCircle, FiShield, FiZap, FiSmartphone } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 text-white overflow-x-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-blue rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() + 0.5, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-4 backdrop-blur-sm bg-dark-900/50 border-b border-neon-blue/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <FiWifi className="text-neon-blue text-3xl" />
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              We-Connect-Fi
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link
              to="/login"
              className="px-6 py-2 rounded-full border border-neon-blue/50 hover:bg-neon-blue/10 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon-blue transition-all duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <HiOutlineSparkles className="text-6xl text-neon-purple" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            Connect Instantly
          </h1>

          <p className="text-2xl md:text-3xl mb-4 text-gray-300">
            with Anyone on Your WiFi
          </p>

          <p className="text-xl md:text-2xl mb-12 text-gray-400 max-w-3xl mx-auto">
            No Numbers • No Contacts • Just Presence
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/register"
              className="inline-block px-12 py-4 text-xl rounded-full bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon-blue transition-all duration-300 animate-glow"
            >
              Start Connecting
            </Link>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-dark-700/50 to-dark-600/50 backdrop-blur-lg border border-neon-blue/30 shadow-glow">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="aspect-square rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 backdrop-blur-sm border border-neon-blue/30 flex items-center justify-center"
                  >
                    <FiUsers className="text-4xl text-neon-blue" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-display font-bold text-center mb-16 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent"
        >
          Features
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FiWifi,
              title: 'Auto WiFi Detection',
              description: 'Automatically discover and connect with everyone on your network',
              color: 'neon-blue',
            },
            {
              icon: FiMessageCircle,
              title: 'Real-Time Messaging',
              description: 'Instant messaging with typing indicators and read receipts',
              color: 'neon-purple',
            },
            {
              icon: FiUsers,
              title: 'Friend System',
              description: 'Send friend requests and build your network',
              color: 'neon-pink',
            },
            {
              icon: FiShield,
              title: 'Privacy First',
              description: 'End-to-end encryption and privacy controls',
              color: 'neon-green',
            },
            {
              icon: FiZap,
              title: 'Lightning Fast',
              description: 'WebSocket-powered real-time communication',
              color: 'neon-yellow',
            },
            {
              icon: FiSmartphone,
              title: 'Cross-Platform',
              description: 'Works seamlessly on laptop, tablet, and mobile',
              color: 'neon-blue',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-dark-700/50 to-dark-600/50 backdrop-blur-lg border border-neon-blue/30 hover:border-neon-purple/50 transition-all duration-300"
            >
              <feature.icon className={`text-5xl mb-4 text-${feature.color}`} />
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-display font-bold text-center mb-16 bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent"
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Sign Up', description: 'Create your account in seconds' },
            { step: '02', title: 'Connect to WiFi', description: 'Join any WiFi network' },
            { step: '03', title: 'Discover Users', description: 'See everyone on your network' },
            { step: '04', title: 'Start Chatting', description: 'Message instantly' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="text-6xl font-display font-bold text-neon-blue/30 mb-4">
                {item.step}
              </div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 rounded-3xl bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 backdrop-blur-lg border border-neon-blue/30"
        >
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Experience the Future of Local Communication?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users connecting instantly on their WiFi networks
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-4 text-xl rounded-full bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon-purple transition-all duration-300"
          >
            Get Started Free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-neon-blue/20 text-center text-gray-400">
        <p>&copy; 2025 We-Connect-Fi. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
