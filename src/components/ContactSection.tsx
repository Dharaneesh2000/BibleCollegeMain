import { useState, useEffect } from "react";
import GITMail from "/images/GITMail.svg";
import GITPhone from "/images/GITPhone.svg";
import GITHome from "/images/GITHome.svg";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import { supabase } from "../lib/supabase";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import type { Country } from 'react-phone-number-input';

interface Course {
  id: string;
  title: string;
  slug: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    select: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [phoneError, setPhoneError] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<Country>('IN');

  // Auto-hide snackbar after 5 seconds
  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSnackbar]);

  // Fetch courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, slug')
          .eq('is_active', true)
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setPhoneError(''); // Clear error on change

    if (!value) {
      setFormData((prev) => ({ ...prev, phone: '' }));
      return;
    }

    // Try to parse phone number to get country
    let country: Country | undefined;
    try {
      const phoneNumber = parsePhoneNumber(value);
      country = phoneNumber?.country as Country;
      if (country) {
        setSelectedCountry(country);
      }
    } catch (e) {
      // If parsing fails, try to detect from country code
      if (value.startsWith('+91')) {
        country = 'IN';
        setSelectedCountry('IN');
      } else if (value.startsWith('+1')) {
        country = 'US';
        setSelectedCountry('US');
      } else if (value.startsWith('+44')) {
        country = 'GB';
        setSelectedCountry('GB');
      }
    }

    // Extract phone number without country code
    const phoneDigits = value.replace(/\D/g, ''); // Get all digits
    let phoneNumber = phoneDigits;

    // Remove country code based on detected country
    if (country === 'IN') {
      phoneNumber = phoneDigits.startsWith('91') ? phoneDigits.substring(2) : phoneDigits;
    } else if (country === 'US' || country === 'CA') {
      phoneNumber = phoneDigits.startsWith('1') ? phoneDigits.substring(1) : phoneDigits;
    } else if (country === 'GB') {
      phoneNumber = phoneDigits.startsWith('44') ? phoneDigits.substring(2) : phoneDigits;
    } else {
      // For other countries, try to detect country code length
      if (phoneDigits.startsWith('91')) {
        phoneNumber = phoneDigits.substring(2);
        country = 'IN';
        setSelectedCountry('IN');
      } else if (phoneDigits.startsWith('1') && phoneDigits.length > 10) {
        phoneNumber = phoneDigits.substring(1);
      } else if (phoneDigits.startsWith('44')) {
        phoneNumber = phoneDigits.substring(2);
        country = 'GB';
        setSelectedCountry('GB');
      }
    }

    // Country-specific limits
    let maxLength = 15; // Default international max
    let errorMessage = '';

    if (country === 'IN') {
      maxLength = 10;
      if (phoneNumber.length > 10) {
        errorMessage = 'Should not exceed 10 numbers';
        setPhoneError(errorMessage);
        return; // Don't update the value
      }
    } else if (country === 'US' || country === 'CA') {
      maxLength = 10;
      if (phoneNumber.length > 10) {
        errorMessage = 'Should not exceed 10 numbers';
        setPhoneError(errorMessage);
        return;
      }
    } else if (country === 'GB') {
      maxLength = 10;
      if (phoneNumber.length > 10) {
        errorMessage = 'Should not exceed 10 numbers';
        setPhoneError(errorMessage);
        return;
      }
    } else {
      // For other countries, use international standard
      maxLength = 15;
      if (phoneNumber.length > 15) {
        errorMessage = 'Should not exceed 15 numbers';
        setPhoneError(errorMessage);
        return;
      }
    }

    // If within limit, update the value
    if (phoneNumber.length <= maxLength) {
      setFormData((prev) => ({ ...prev, phone: value }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Validation
      if (!formData.name.trim()) {
        setSubmitStatus({ type: 'error', message: 'Name is required' });
        setShowSnackbar(true);
        setSubmitting(false);
        return;
      }

      if (!formData.email.trim()) {
        setSubmitStatus({ type: 'error', message: 'Email is required' });
        setShowSnackbar(true);
        setSubmitting(false);
        return;
      }

      if (!validateEmail(formData.email.trim())) {
        setSubmitStatus({ type: 'error', message: 'Please enter a valid email address' });
        setShowSnackbar(true);
        setSubmitting(false);
        return;
      }

      if (formData.phone && !isValidPhoneNumber(formData.phone)) {
        setSubmitStatus({ type: 'error', message: 'Please enter a valid phone number' });
        setShowSnackbar(true);
        setSubmitting(false);
        return;
      }

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        console.warn('Supabase not configured - form submission skipped');
        setSubmitStatus({ type: 'error', message: 'Form submission is not configured yet. Please contact us directly.' });
        setShowSnackbar(true);
        setSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          selected_course: formData.select || null,
          message: '',
        }]);

      if (error) throw error;

      setSubmitStatus({ type: 'success', message: 'Thank you! Your message has been submitted successfully.' });
      setShowSnackbar(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        select: "",
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to submit. Please try again later.' });
      setShowSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 text-white relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Snackbar Notification */}
      {showSnackbar && submitStatus.type && (
        <div
          className={`fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md z-50 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl transform transition-all duration-300 ${submitStatus.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
            }`}
          style={{
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircleIcon className="text-white flex-shrink-0" style={{ fontSize: '20px' }} />
          ) : (
            <ErrorIcon className="text-white flex-shrink-0" style={{ fontSize: '20px' }} />
          )}
          <span className="font-medium text-sm sm:text-base flex-1">{submitStatus.message}</span>
          <button
            onClick={() => setShowSnackbar(false)}
            className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors flex-shrink-0"
          >
            <CloseIcon className="text-white" style={{ fontSize: '18px' }} />
          </button>
        </div>
      )}

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/GetInTouch.png"
          alt="Contact God's Will Bible College - Get in touch for admissions and information"
          className="w-full h-full object-cover object-center"
          width="1920"
          height="1080"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        <div className="absolute inset-0 bg-black opacity-0"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 lg:gap-x-32 items-start">
          {/* Left side - Contact info */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 id="contact-heading" className="text-[28px] sm:text-[32px] lg:text-[38px] font-[700] mb-3 sm:mb-4 text-white">
                Get in touch with us
              </h2>
              <p className="text-[16px] sm:text-[18px] font-[400] text-white" style={{ lineHeight: '1.3', paddingBottom: '32px' }}>
                Everything you need to know about our Bible College, programs,
                admissions, and life on campus — all in one place.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Email */}
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 pb-4 sm:pb-6 border-b border-gray-600">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FFFFFF1A" }}
                >
                  <img
                    src={GITMail}
                    alt="Email contact icon for God's Will Bible College"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    width="24"
                    height="24"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href="mailto:godswillbiblecollege2025@gmail.com"
                    className="text-[14px] sm:text-[16px] lg:text-[18px] font-medium text-white cursor-pointer hover:opacity-80 break-all"
                    aria-label="Send email to godswillbiblecollege2025@gmail.com"
                    title="Click to send an email"
                  >
                    godswillbiblecollege2025@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 pb-4 sm:pb-6 border-b border-gray-600">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FFFFFF1A" }}
                >
                  <img
                    src={GITPhone}
                    alt="Phone contact icon for God's Will Bible College"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    width="24"
                    height="24"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] sm:text-[16px] lg:text-[18px] font-medium text-white">
                    <a
                      href="tel:+919841012879"
                      className="text-white cursor-pointer hover:opacity-80 block mb-1"
                      aria-label="Call +91 98410 12879"
                      title="Click to call +91 98410 12879"
                    >
                      +91 98410 12879
                    </a>
                    <a
                      href="tel:+919942073588"
                      className="text-white cursor-pointer hover:opacity-80 block"
                      aria-label="Call +91 99420 73588"
                      title="Click to call +91 99420 73588"
                    >
                      +91 99420 73588
                    </a>
                  </p>
                </div>
              </div>

              {/* Office Address */}
              <div className="flex items-start space-x-3 sm:space-x-4 pb-4 sm:pb-6 border-b border-gray-600">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FFFFFF1A" }}
                >
                  <img
                    src={GITHome}
                    alt="Office location icon"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    width="24"
                    height="24"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] sm:text-[16px] lg:text-[18px] font-medium text-white">
                    No 44 Srinivasa Nagar, Podanur, Coimbatore 641023,<br />
                    Tamil Nadu. India
                  </p>
                </div>
              </div>

              {/* Campus Address */}
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FFFFFF1A" }}
                >
                  <SchoolIcon sx={{ fontSize: { xs: '20px', sm: '24px' }, color: 'white' }} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] sm:text-[16px] lg:text-[18px] font-medium text-white">
                    Pannapti pirivu, Pannapti.<br />
                    Coimbatore, Tamil Nadu, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Contact form */}
          <div className="bg-white rounded-lg pt-6 px-4 sm:pt-8 sm:px-6 lg:pt-10 lg:px-10 self-start" style={{ paddingBottom: '1rem' }}>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" aria-label="Contact form">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black placeholder-gray-400"
                  placeholder="Name"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black placeholder-gray-400"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <div className={`phone-input ${phoneError ? 'error' : ''}`}>
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    country={selectedCountry}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full"
                    placeholder="Phone Number"
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              <div>
                <select
                  id="select"
                  name="select"
                  value={formData.select}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent bg-white appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    color: '#9CA3AF'
                  }}
                >
                  <option value="" disabled style={{ color: '#9CA3AF' }}>What type of course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id} style={{ color: '#9CA3AF' }}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group w-full bg-bible-blue text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#15133D" }}
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-2">
                  {submitting ? 'Submitting...' : 'Schedule a call'}
                </span>
                {!submitting && (
                  <ArrowRightAltIcon className="opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
