"use client"
import { motion } from "framer-motion"

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-0"
          >
            <span className="text-green-600 dark:text-green-400 text-xl font-bold">🌿 GroWise</span>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Smart Financial Planning for Everyone</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex space-x-6"
          >
            <a href="#" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
              Terms
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
              Privacy
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
              Help
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} GroWise. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
