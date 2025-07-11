import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ContactForm from '@/components/ContactForm';

export default function Contact() {
  return (
    <Layout title="Contact Us - Kamunity">
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 px-6 lg:px-12 bg-gradient-to-br from-indigo-50 to-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="ellipse-decoration w-96 h-96 -top-48 -right-48 animate-float" />
            <div className="ellipse-decoration w-64 h-64 bottom-0 left-1/4 animate-float" style={{ animationDelay: '3s' }} />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-indigo-700 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-charcoal leading-relaxed mb-8">
              Have a question, idea, or want to join our community? We'd love to hear from you!
            </p>
            <p className="text-lg text-charcoal leading-relaxed">
              Whether you're interested in partnerships, have feedback, or just want to say hello, 
              drop us a message and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-lavender-100"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-indigo-700 mb-4">
                  Send us a Message
                </h2>
                <p className="text-lg text-charcoal">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <ContactForm />
            </motion.div>
          </div>
        </section>

        {/* Alternative Contact Methods */}
        <section className="py-16 px-6 lg:px-12 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-indigo-700 mb-4">
                Other Ways to Connect
              </h2>
              <p className="text-lg text-charcoal">
                Choose the method that works best for you
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-4">Email Us</h3>
                <p className="text-charcoal mb-4">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <a 
                  href="mailto:hello@kamunity.ai" 
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  hello@kamunity.ai
                </a>
              </motion.div>

              {/* Community */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gold-600 mb-4">Join Our Community</h3>
                <p className="text-charcoal mb-4">
                  Be part of the conversation and connect with like-minded individuals.
                </p>
                <a 
                  href="/welcome" 
                  className="text-gold-600 hover:text-gold-700 font-medium"
                >
                  Get Started
                </a>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-peach-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-peach-600 mb-4">Get Support</h3>
                <p className="text-charcoal mb-4">
                  Need help or have technical questions? We're here to assist you.
                </p>
                <span className="text-peach-600 font-medium">
                  Use the chat widget below
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-indigo-700 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-charcoal">
                Quick answers to common questions
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: "What is Kamunity?",
                  answer: "Kamunity is a community-driven platform that fosters connection, growth, and positive change. We believe that community begins with one spark, and we're here to help that spark grow into something amazing."
                },
                {
                  question: "How can I join the community?",
                  answer: "You can start by subscribing to our newsletter on any page, or visit our Welcome page to learn more about getting involved. We'll keep you updated on community events and opportunities."
                },
                {
                  question: "Is Kamunity free to use?",
                  answer: "Yes! Our core community features are free for everyone. We believe in making meaningful connections accessible to all."
                },
                {
                  question: "How do I stay updated on new features?",
                  answer: "Subscribe to our newsletter and follow our content feed for the latest updates, community stories, and new feature announcements."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-lavender-50 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-charcoal leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
} 