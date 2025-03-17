// Profile.jsx
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import useAxios from '../utils/useAxios';
import Swal from 'sweetalert2';

const Profile = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const axios = useAxios();
  const [profileData, setProfileData] = useState({
    full_name: '',
    bio: '',
    image: null
  });
  const [isEditing, setIsEditing] = useState(false);

  const isDevelopment = import.meta.env.MODE === 'development'
  const BaseUrl = isDevelopment ? import.meta.env.VITE_LOCAL_BASEURL : import.meta.env.VITE_DEPLOY_BASEURL;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/profile/');
      setProfileData({
        full_name: response.data.profile.full_name || '',
        bio: response.data.profile.bio || '',
        image: response.data.profile.image || null
      });
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      Swal.fire({
        title: 'Error loading profile',
        icon: 'error',
        toast: true,
        timer: 6000,
        position: 'top-right'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProfileData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('full_name', profileData.full_name || '');
      formData.append('bio', profileData.bio || '');
      if (profileData.image && typeof profileData.image !== 'string') {
        formData.append('image', profileData.image);
      } else if (!profileData.image) {
        formData.append('image', '');
      }

      console.log([...formData]); // Debug: Check FormData contents

      const response = await axios.put('/profile/update/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfileData({
        full_name: response.data.full_name,
        bio: response.data.bio,
        image: response.data.image
      });

      setIsEditing(false);
      Swal.fire({
        title: 'Profile Updated',
        icon: 'success',
        toast: true,
        timer: 6000,
        position: 'top-right'
      });
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      Swal.fire({
        title: `Error: ${error.response?.data?.detail || 'Failed to update profile'}`,
        icon: 'error',
        toast: true,
        timer: 6000,
        position: 'top-right'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Profile</h2>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {profileData.image && (
                <img
                  src={
                    typeof profileData.image === 'string'
                      ? `${BaseUrl}${profileData.image}`
                      : URL.createObjectURL(profileData.image)
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  <span className="text-gray-500">Username:</span> {user.username}
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  <span className="text-gray-500">Email:</span> {user.email}
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              <span className="font-medium">Full Name:</span> {profileData.full_name || 'Not set'}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Bio:</span> {profileData.bio || 'No bio provided'}
            </p>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Edit Profile
              </button>
              <button
                onClick={logoutUser}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={profileData.full_name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Tell us about yourself"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;