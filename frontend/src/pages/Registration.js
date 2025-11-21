import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { mockCategories, mockReferences, mockDistricts, mockStates } from '../mock';
import { validatePhone, validateEmail, validateAadhar } from '../utils/helpers';
import { User, Phone, MapPin, Briefcase, UserCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

const Registration = () => {
  const navigate = useNavigate();
  const { addPatient, campInfo } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    mobile: '',
    aadhar: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    post: '',
    pincode: '',
    district: 'Thrissur',
    state: 'Kerala',
    country: 'India',
    campPlace: campInfo.campLocation,
    campDate: new Date().toISOString().split('T')[0],
    campOfficial: campInfo.campOfficial,
    reference: 'Self',
    referenceDetails: '',
    patientCategory: 'General',
    emergencyContact: {
      name: '',
      mobile: '',
      relationship: ''
    }
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.age || formData.age < 1 || formData.age > 120) newErrors.age = 'Valid age required';
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile is required';
    } else if (!validatePhone(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (formData.aadhar && !validateAadhar(formData.aadhar)) {
      newErrors.aadhar = 'Invalid Aadhar format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const newPatient = addPatient(formData);
      setLoading(false);
      
      toast({
        title: "Camp patient added to queue",
        description: `${newPatient.id} · ${newPatient.fullName}`,
      });

      setTimeout(() => {
        const shouldGoToQueue = window.confirm('Patient registered successfully!\n\nGo to Queue or Register Next?\n\nOK = Go to Queue\nCancel = Register Next');
        if (shouldGoToQueue) {
          navigate('/queue');
        } else {
          // Reset form
          setFormData({
            ...formData,
            fullName: '',
            age: '',
            mobile: '',
            aadhar: '',
            email: '',
            addressLine1: '',
            addressLine2: '',
            emergencyContact: { name: '', mobile: '', relationship: '' }
          });
        }
      }, 500);
    }, 800);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Toaster />
      
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] dark:from-[#1E3A8A] dark:to-[#1E40AF] rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">New Camp Registration</h2>
        <p className="text-[#BFDBFE] dark:text-[#93C5FD] text-sm">
          Register patient for camp and add to consultation queue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Identity */}
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Patient Identity</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">
                Full Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.fullName ? 'border-[#EF4444]' : 'border-[#E5E7EB] dark:border-[#1E293B]'
                } bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all`}
                placeholder="Enter full name"
              />
              {errors.fullName && <p className="text-xs text-[#EF4444] mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">
                Age <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.age ? 'border-[#EF4444]' : 'border-[#E5E7EB] dark:border-[#1E293B]'
                } bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all`}
                placeholder="Age"
              />
              {errors.age && <p className="text-xs text-[#EF4444] mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">
                Gender <span className="text-[#EF4444]">*</span>
              </label>
              <div className="flex gap-2">
                {['Male', 'Female', 'Other'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleChange('gender', g)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      formData.gender === g
                        ? 'bg-[#2563EB] text-white shadow-lg'
                        : 'bg-[#F5F7FB] dark:bg-[#020617] text-[#6B7280] dark:text-[#94A3B8] border border-[#E5E7EB] dark:border-[#1E293B]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">
                Mobile <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.mobile ? 'border-[#EF4444]' : 'border-[#E5E7EB] dark:border-[#1E293B]'
                } bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all`}
                placeholder="10-digit mobile"
              />
              {errors.mobile && <p className="text-xs text-[#EF4444] mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">
                Aadhar
              </label>
              <input
                type="text"
                value={formData.aadhar}
                onChange={(e) => handleChange('aadhar', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                placeholder="1234-5678-9012"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Address & Location</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Address Line 1</label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                placeholder="House/Building name"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Address Line 2</label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => handleChange('addressLine2', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                placeholder="Street/Locality"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Post</label>
              <input
                type="text"
                value={formData.post}
                onChange={(e) => handleChange('post', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                placeholder="Post Office"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                placeholder="6-digit pincode"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">District</label>
              <select
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
              >
                {mockDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">State</label>
              <select
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
              >
                {mockStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Camp Details */}
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Camp Details</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Reference</label>
              <select
                value={formData.reference}
                onChange={(e) => handleChange('reference', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
              >
                {mockReferences.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Patient Category</label>
              <select
                value={formData.patientCategory}
                onChange={(e) => handleChange('patientCategory', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
              >
                {mockCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCircle className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Emergency Contact</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Name</label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                placeholder="Contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Mobile</label>
              <input
                type="tel"
                value={formData.emergencyContact.mobile}
                onChange={(e) => handleEmergencyContactChange('mobile', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                placeholder="Mobile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Relationship</label>
              <input
                type="text"
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                placeholder="Relationship"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-20 pb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Camp MR & Add to Queue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
