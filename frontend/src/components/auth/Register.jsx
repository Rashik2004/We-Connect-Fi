import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCalendar,
  FaPen,
  FaImage,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    bio: '',
    avatar: null,
  });
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);

  const totalSteps = 6;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.username) newErrors.username = 'Username is required';
        if (formData.username && formData.username.length < 3) {
          newErrors.username = 'Username must be at least 3 characters';
        }
        break;
      case 2:
        if (!formData.email) newErrors.email = 'Email is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        break;
      case 3:
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password && formData.password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
      case 4:
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        break;
      case 5:
        if (!formData.bio) newErrors.bio = 'Bio is required';
        if (formData.bio && formData.bio.length < 10) {
          newErrors.bio = 'Bio must be at least 10 characters';
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('dateOfBirth', formData.dateOfBirth);
      data.append('bio', formData.bio);
      if (formData.avatar) {
        data.append('avatar', formData.avatar);
      }

      await register(data);
      toast.success('Account created successfully!');
      navigate('/app');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const slideVariants = {
      enter: { opacity: 0, x: 50 },
      center: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    };

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 mb-4">
                <FaUser className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Choose a Username</h3>
              <p className="text-gray-400">This is how others will see you</p>
            </div>
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              icon={<FaUser />}
              error={errors.username}
              required
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 mb-4">
                <FaEnvelope className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Enter Your Email</h3>
              <p className="text-gray-400">We'll use this to keep your account secure</p>
            </div>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              icon={<FaEnvelope />}
              error={errors.email}
              required
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 mb-4">
                <FaLock className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Secure Your Account</h3>
              <p className="text-gray-400">Choose a strong password</p>
            </div>
            <div className="space-y-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<FaLock />}
                error={errors.password}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<FaLock />}
                error={errors.confirmPassword}
                required
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 mb-4">
                <FaCalendar className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Date of Birth</h3>
              <p className="text-gray-400">When's your birthday?</p>
            </div>
            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              icon={<FaCalendar />}
              error={errors.dateOfBirth}
              required
            />
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 mb-4">
                <FaPen className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Tell Us About Yourself</h3>
              <p className="text-gray-400">Write a short bio</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="I'm a student passionate about technology..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-700 border-2 border-gray-300 dark:border-dark-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none"
              />
              {errors.bio && (
                <p className="mt-2 text-sm text-red-500">{errors.bio}</p>
              )}
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 mb-4">
                <FaImage className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Profile Picture</h3>
              <p className="text-gray-400">Upload your avatar (optional)</p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              {avatarPreview && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500"
                >
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
              
              <label className="cursor-pointer">
                <div className="px-6 py-3 bg-dark-700 hover:bg-dark-600 rounded-xl border-2 border-dashed border-gray-600 hover:border-cyan-500 transition-all text-center">
                  <FaImage className="mx-auto text-2xl text-cyan-400 mb-2" />
                  <p className="text-white font-medium">
                    {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card glass className="backdrop-blur-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-400">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <Button
                variant="secondary"
                onClick={prevStep}
                icon={<FaArrowLeft />}
                className="flex-1"
              >
                Back
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                variant="primary"
                onClick={nextStep}
                icon={<FaArrowRight />}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                icon={<FaCheck />}
                className="flex-1"
              >
                Complete
              </Button>
            )}
          </div>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Sign In
            </Link>
          </p>
        </Card>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
