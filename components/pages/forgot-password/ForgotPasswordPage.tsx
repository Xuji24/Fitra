import ForgotPasswordForm from "./component/forgot-password-form";
import LoginFooter from "@/components/pages/login/component/login-footer";
import LoginHero from "@/components/pages/login/component/login-hero";
import Logo from "@/components/logo";

export default function ForgotPasswordPage() {
  return (
    <div className="flex h-screen w-full bg-[#F4F3F6] dark:bg-[#193C43]">
      {/* Left Side - Forgot Password Form */}
      <div className="flex flex-col w-full lg:w-1/2 h-screen">
        {/* Logo */}
        <div className="px-6 sm:px-10 pt-4 sm:pt-5 animate-slide-in-left">
          <Logo />
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-12 xl:px-20">
          <div className="w-full max-w-sm">
            {/* Heading */}
            <h1 className="font-raleway font-bold text-3xl sm:text-4xl text-[#193C43] dark:text-[#F4F3F6] mb-2 animate-slide-in-left">
              Forgot Password
            </h1>
            <p className="font-merriweather-sans text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 animate-slide-in-left animation-delay-100">
              Enter your active email account of Be Fit ERA
            </p>

            {/* Forgot Password Form */}
            <ForgotPasswordForm />
          </div>
        </div>

        {/* Footer */}
        <div className="animate-fade-in animation-delay-500">
          <LoginFooter />
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <LoginHero />
    </div>
  );
}
