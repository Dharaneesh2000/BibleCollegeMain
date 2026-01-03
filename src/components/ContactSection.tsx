import { useState, useEffect } from "react";
import GITMail from "/images/GITMail.png";
import GITPhone from "/images/GITPhone.png";
import GITHome from "/images/GITHome.png";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../lib/supabase";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    courseType: "",
    select: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Auto-hide snackbar after 5 seconds
  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSnackbar]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
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
          message: formData.message,
          course_type: formData.courseType || null,
          selected_course: formData.select || null,
        }]);

      if (error) throw error;

      setSubmitStatus({ type: 'success', message: 'Thank you! Your message has been submitted successfully.' });
      setShowSnackbar(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        courseType: "",
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
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 ${
            submitStatus.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
          style={{
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircleIcon className="text-white" />
          ) : (
            <ErrorIcon className="text-white" />
          )}
          <span className="font-medium">{submitStatus.message}</span>
          <button
            onClick={() => setShowSnackbar(false)}
            className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <CloseIcon className="text-white text-sm" />
          </button>
        </div>
      )}

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/GetInTouch.png"
          alt="Contact God's Will Bible College - Get in touch for admissions and information"
          className="w-full h-full object-cover"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-black opacity-0"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Contact info */}
          <div>
            <h2 id="contact-heading" className="text-[38px] font-[700] mb-5 text-white">
              Get in touch with us
            </h2>
            <p className="text-[18px] font-[400] mb-8 text-white leading-relaxed">
              Everything you need to know about our Bible College, programs,
              admissions, and life on campus — all in one place.
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-600">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FFFFFF1A" }}
                >
                  <img
                    src={GITMail}
                    alt="Email contact icon for God's Will Bible College"
                    className="w-6 h-6 object-contain"
                    width="24"
                    height="24"
                  />
                </div>
                <div>
                  <p className="text-[22px] font-medium text-white">
                    johnruban10@gmail.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-600">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FFFFFF1A" }}
                >
                  <img
                    src={GITPhone}
                    alt="Phone contact icon for God's Will Bible College"
                    className="w-6 h-6 object-contain"
                    width="24"
                    height="24"
                  />
                </div>
                <div>
                  <p className="text-[22px] font-medium text-white">
                    +91 97912 37955
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FFFFFF1A" }}
                >
                  <img
                    src={GITHome}
                    alt="Address location icon for God's Will Bible College in Rourkela, Odisha"
                    className="w-6 h-6 object-contain"
                    width="24"
                    height="24"
                  />
                </div>
                <div>
                  <p className="text-[22px] font-medium text-white">
                    No. 24, Gandhi Street<span className="hidden lg:inline"><br /></span> Anna Nagar, Chennai - 600040 Tamil
                    Nadu, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Contact form */}
          <div className="bg-white rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black"
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <input
                  type="text"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black"
                  placeholder="Message"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  id="courseType"
                  name="courseType"
                  value={formData.courseType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black"
                  placeholder="What type of course"
                />
              </div>

              <div>
                <select
                  id="select"
                  name="select"
                  value={formData.select}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black"
                >
                  <option value="">Select</option>
                  <option value="bachelor">Bachelor of Theology</option>
                  <option value="master">Master of Divinity</option>
                  <option value="certificate">Certificate Program</option>
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
