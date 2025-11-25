import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  ArrowRight,
  Zap,
  Target,
  Brain,
  CheckCircle,
  Star,
  Shield,
  Globe
} from 'lucide-react';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 3 seconds if user doesn't take action
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      title: 'Advanced KPI Analytics',
      description: 'Real-time business intelligence with interactive dashboards',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FileText className="w-8 h-8 text-green-500" />,
      title: 'Document Generation',
      description: 'Export reports as PDF, Excel, and custom formats',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: 'Customer Intelligence',
      description: 'Deep insights into customer behavior and lifetime value',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      title: 'Sales Analytics',
      description: 'Comprehensive sales tracking and performance metrics',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
      title: 'Global Scale',
      description: 'Deploy anywhere with cloud-native architecture',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const kpiCategories = [
    {
      icon: <Zap className="w-6 h-6 text-green-600" />,
      title: 'Quick Wins',
      description: 'High-impact metrics for immediate insights',
      href: '/dashboard/kpi/quick-wins',
      color: 'border-green-200 hover:border-green-300'
    },
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: 'Advanced Analytics',
      description: 'Deep operational insights and analytics',
      href: '/dashboard/kpi/advanced-analytics',
      color: 'border-blue-200 hover:border-blue-300'
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: 'Strategic Intelligence',
      description: 'Long-term strategic planning and insights',
      href: '/dashboard/kpi/strategic-insights',
      color: 'border-purple-200 hover:border-purple-300'
    }
  ];

  return (
    <>
      <Head>
        <title>KPI Dashboard - Business Intelligence Analytics Platform</title>
        <meta name="description" content="Advanced KPI Dashboard with comprehensive business intelligence, real-time analytics, and document generation capabilities" />
        <meta name="keywords" content="KPI dashboard, business intelligence, analytics, data visualization, sales analytics, customer analytics" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                    <BarChart3 className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                  Advanced
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {' '}KPI Dashboard
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Comprehensive business intelligence platform with real-time analytics, 
                  document generation, and actionable insights for modern enterprises.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <BarChart3 className="w-6 h-6 mr-3" />
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                
                <Link
                  href="/dashboard/kpi/quick-wins"
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  <Zap className="w-6 h-6 mr-3 text-green-600" />
                  Quick Wins KPIs
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500"
              >
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Real-time Analytics
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Document Export
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Cloud Ready
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Modern Businesses
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to make data-driven decisions and drive business growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Categories */}
        <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Comprehensive KPI Categories
              </h2>
              <p className="text-xl text-gray-600">
                Explore our three-tier approach to business intelligence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {kpiCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Link
                    href={category.href}
                    className={`block p-8 bg-white rounded-2xl border-2 ${category.color} hover:shadow-xl transition-all duration-300 group`}
                  >
                    <div className="flex items-center mb-4">
                      {category.icon}
                      <h3 className="text-xl font-semibold text-gray-900 ml-3 group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      {category.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      Explore KPI Dashboard
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Business Intelligence?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Start exploring your data with our comprehensive KPI dashboard platform
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <BarChart3 className="w-6 h-6 mr-3" />
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-white">
                  KPI Dashboard
                </span>
              </div>
              <p className="text-gray-400">
                Advanced Business Intelligence Platform • Powered by MiniMax Agent
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;