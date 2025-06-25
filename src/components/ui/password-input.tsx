import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, AlertTriangle, Check } from 'lucide-react';
import { checkPasswordStrength } from '@/lib/security';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrengthMeter?: boolean;
  className?: string;
  id?: string;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = 'رمز عبور را وارد کنید',
  showStrengthMeter = true,
  className = '',
  id = 'password'
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<{ score: number; feedback: string[] }>({ score: 0, feedback: [] });
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value) {
      setStrength(checkPasswordStrength(value));
    } else {
      setStrength({ score: 0, feedback: [] });
    }
  }, [value]);

  const getStrengthColor = (score: number) => {
    if (score < 2) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    if (score < 6) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return 'ضعیف';
    if (score < 4) return 'متوسط';
    if (score < 6) return 'خوب';
    return 'عالی';
  };

  const getStrengthIcon = (score: number) => {
    if (score < 4) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (score < 6) return <Shield className="w-4 h-4 text-yellow-500" />;
    return <Check className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${className}`}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {showStrengthMeter && value && (isFocused || strength.score < 4) && (
        <div className="space-y-2">
          {/* Strength meter */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {getStrengthIcon(strength.score)}
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>قدرت رمز عبور: {getStrengthText(strength.score)}</span>
                <span>{Math.round((strength.score / 7) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
                  style={{ width: `${(strength.score / 7) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {strength.feedback.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <p className="text-sm font-medium text-amber-800 mb-2">
                برای افزایش امنیت رمز عبور:
              </p>
              <ul className="text-sm text-amber-700 space-y-1">
                {strength.feedback.map((feedback, index) => (
                  <li key={index} className="flex items-center space-x-2 space-x-reverse">
                    <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
                    <span>{feedback}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Security requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm font-medium text-blue-800 mb-2">
              الزامات امنیتی:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
              <div className={`flex items-center space-x-1 space-x-reverse ${value.length >= 8 ? 'text-green-700' : 'text-gray-600'}`}>
                <Check className={`w-3 h-3 ${value.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                <span>حداقل ۸ کاراکتر</span>
              </div>
              <div className={`flex items-center space-x-1 space-x-reverse ${/[a-z]/.test(value) ? 'text-green-700' : 'text-gray-600'}`}>
                <Check className={`w-3 h-3 ${/[a-z]/.test(value) ? 'text-green-500' : 'text-gray-400'}`} />
                <span>حروف کوچک انگلیسی</span>
              </div>
              <div className={`flex items-center space-x-1 space-x-reverse ${/[A-Z]/.test(value) ? 'text-green-700' : 'text-gray-600'}`}>
                <Check className={`w-3 h-3 ${/[A-Z]/.test(value) ? 'text-green-500' : 'text-gray-400'}`} />
                <span>حروف بزرگ انگلیسی</span>
              </div>
              <div className={`flex items-center space-x-1 space-x-reverse ${/\d/.test(value) ? 'text-green-700' : 'text-gray-600'}`}>
                <Check className={`w-3 h-3 ${/\d/.test(value) ? 'text-green-500' : 'text-gray-400'}`} />
                <span>حداقل یک عدد</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 