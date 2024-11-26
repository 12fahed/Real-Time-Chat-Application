import { useState, useRef, useCallback, useEffect } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, Phone, User } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePatter"
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Improved OTP handling hook
const useOTPInput = (length = 5) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const otpInputRefs = useRef(Array(length).fill(null));

  const handleOTPInput = useCallback((value, index) => {
    // Validate input (only numbers)
    if (value && !/^\d$/.test(value)) return;

    // Create a copy of the current OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if a digit is entered
    if (value && index < length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }, [otp, length]);

  const handleOTPKeyDown = useCallback((e, index) => {
    // Handle backspace to move focus and clear previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const validateOTP = useCallback(() => {
    const otpString = otp.join('');
    
    // Check if OTP is complete and valid
    if (otpString.length !== length) {
      toast.error(`Please enter a ${length}-digit OTP`);
      return null;
    }

    // Optional: Additional validation if needed
    if (!/^\d+$/.test(otpString)) {
      toast.error('OTP must contain only digits');
      return null;
    }

    return otpString;
  }, [otp, length]);

  const resetOTP = useCallback(() => {
    setOtp(Array(length).fill(""));
  }, [length]);

  return {
    otp,
    otpInputRefs,
    handleOTPInput,
    handleOTPKeyDown,
    validateOTP,
    resetOTP
  };
};

// OTP Modal Component
const OTPModal = ({ 
  email, 
  onVerify, 
  onClose,
  isOpen 
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if(dialogRef.current) {
      dialogRef.current.close()
    }
  }, [isOpen]);

  const { 
    otp, 
    otpInputRefs, 
    handleOTPInput, 
    handleOTPKeyDown, 
    validateOTP,
    resetOTP 
  } = useOTPInput();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validatedOTP = validateOTP();
    if (!validatedOTP) return;

    try {
      const isVerified = await onVerify(validatedOTP);
      
      if (isVerified) {
        resetOTP(); // Clear OTP after successful verification
        onClose(); // Close the modal
      }
    } catch (error) {
      toast.error("Error verifying OTP", error);
    }
  };

  const handleClose = () => {
    resetOTP();
    onClose();
  };

  return (
    <dialog 
      ref={dialogRef} 
      id="otp_modal" 
      className="modal"
      onClose={handleClose}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Enter OTP</h3>
        <p className="pt-4">Please enter the 5-digit OTP sent to {email}.</p>
        <p className="text-sm text-base-content/70 pb-4">Please check the spam folder if the OTP is not found.</p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => otpInputRefs.current[index] = el}
                type="text"
                maxLength={1}
                pattern="\d*"
                inputMode="numeric"
                className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={digit}
                onChange={(e) => handleOTPInput(e.target.value, index)}
                onKeyDown={(e) => handleOTPKeyDown(e, index)}
              />
            ))}
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">Submit</button>
            <button
              type="button"
              className="btn"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

// SignUp Page Component
const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp, createOTP, verifyOTP } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    phno: "",
    email: "",
    password: "",
  });
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.phno.trim()) {
      toast.error("Phone Number is required");
      return false;
    }
    if (formData.phno.length!=10) {
      toast.error("Phone Number should be 10 Digits");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const openOTPModal = async () => {
    try {
      // Call createOTP endpoint
      await createOTP({ email: formData.email });
      setIsOTPModalOpen(true);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.", error);
    }
  };

  const handleOTPVerification = async (otp) => {
    try {
      const otpData = {
        otp,
        email: formData.email
      };
    
      const isVerified = await verifyOTP(otpData);
      
      if (isVerified && isVerified.message === "OTP Verified") {
        // Proceed with signup
        await signup(formData);
        return true;
      } else {
        toast.error("Invalid OTP. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error("Error verifying OTP");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) return;

    // Open OTP modal
    await openOTPModal();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 pt-5">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="9876543210"
                  value={formData.phno}
                  onChange={(e) => setFormData({ ...formData, phno: e.target.value })}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-full" 
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />

      {/* OTP Modal */}
      
      <OTPModal 
        email={formData.email}
        onVerify={handleOTPVerification}
        onClose={() => setIsOTPModalOpen(false)}
        isOpen={isOTPModalOpen}
      />
      
    </div>
  );
};

export default SignUpPage;