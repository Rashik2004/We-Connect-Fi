import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useAuthStore from '../../../stores/authStore';
import Avatar from '../../ui/Avatar';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const ProfileEdit = ({ onCancel, onSave }) => {
  const { user, updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.bio) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('bio', formData.bio);
      data.append('dateOfBirth', formData.dateOfBirth);
      
      if (avatar) {
        data.append('avatar', avatar);
      }
      
      await updateProfile(data);
      toast.success('Profile updated successfully!');
      if (onSave) onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-dark-600">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Profile
              </h2>
              <button
                type="button"
                onClick={onCancel}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
              >
                <FaTimes className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <Avatar src={avatarPreview} alt="Profile" size="xl" />
              
              <label className="cursor-pointer">
                <div className="px-6 py-3 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-600 hover:border-cyan-500 transition-all text-center">
                  <FaImage className="mx-auto text-2xl text-cyan-500 mb-2" />
                  <p className="text-gray-900 dark:text-white font-medium">
                    Change Avatar
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form Fields */}
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
              error={errors.username}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-700 border-2 border-gray-300 dark:border-dark-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none"
              />
              {errors.bio && (
                <p className="mt-2 text-sm text-red-500">{errors.bio}</p>
              )}
            </div>

            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
            />

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-dark-600">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={<FaSave />}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileEdit;
