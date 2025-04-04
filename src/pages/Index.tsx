import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  {
    title: "Payroll Management",
    description: "Streamline payroll processing, tax calculations, and direct deposits."
  },
  {
    title: "Employee Self-Service",
    description: "Empower employees with access to pay stubs, benefits, and time off requests."
  },
  {
    title: "HR Administration",
    description: "Simplify employee onboarding, document management, and compliance."
  }
];

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      navigate(`/${userRole}/dashboard`);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-primary text-white font-bold text-2xl shadow-lg">
            LP
          </div>
        </div>
        
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 sm:text-6xl md:text-7xl">
          PRMS <span className="text-primary">Payroll</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          A comprehensive payroll and HR management platform designed to streamline your business operations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-6 py-3 text-lg font-semibold shadow-md hover:shadow-lg transition" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </motion.div>
      
      <motion.div 
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {features.map((feature, index) => (
          <div key={index} className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Index;