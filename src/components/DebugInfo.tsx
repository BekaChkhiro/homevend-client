import { useEffect } from 'react';

// Same API_BASE_URL logic as in api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const DebugInfo = () => {
  useEffect(() => {
    // CRITICAL: Show key information first
    const isProduction = import.meta.env.PROD;
    const apiUrl = import.meta.env.VITE_API_URL;
    
    if (isProduction) {
      console.log(
        '%c🚨 PRODUCTION DEPLOYMENT DEBUG 🚨',
        'background: #dc2626; color: white; padding: 12px 20px; border-radius: 4px; font-size: 16px; font-weight: bold;'
      );
      console.log(
        '%cCRITICAL INFO - API URL: ' + apiUrl,
        'background: #f59e0b; color: white; padding: 8px 12px; border-radius: 4px; font-size: 14px; font-weight: bold;'
      );
      console.log(
        '%cCURRENT DOMAIN: ' + window.location.origin,
        'background: #3b82f6; color: white; padding: 8px 12px; border-radius: 4px; font-size: 14px; font-weight: bold;'
      );
    }

    // Log comprehensive environment information on app load
    console.group('🔧 HomevEnd Debug Information');
    console.log('🌍 Environment Details:', {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
      apiUrl: import.meta.env.VITE_API_URL,
      baseUrl: API_BASE_URL,
      allEnvVars: import.meta.env
    });
    
    console.log('🌐 Browser Information:', {
      userAgent: navigator.userAgent,
      currentUrl: window.location.href,
      origin: window.location.origin,
      pathname: window.location.pathname,
      protocol: window.location.protocol,
      host: window.location.host
    });
    
    console.log('🔐 Authentication State:', {
      hasToken: !!localStorage.getItem('token'),
      hasRefreshToken: !!localStorage.getItem('refreshToken'),
      hasUserId: !!localStorage.getItem('userId'),
      tokenPrefix: localStorage.getItem('token')?.substring(0, 20) + '...' || 'N/A'
    });
    
    console.log('🔗 API Configuration Check:', {
      expectedProdUrl: 'https://homevend-server.onrender.com/api',
      actualApiUrl: apiUrl,
      isCorrectProdConfig: apiUrl === 'https://homevend-server.onrender.com/api',
      corsWillWork: window.location.origin === 'https://homevend.ge' || window.location.origin === 'https://www.homevend.ge'
    });
    
    console.log('⏰ Load Time:', new Date().toISOString());
    console.groupEnd();

    // Add a helpful message to the console
    console.log(
      '%c🏠 HomevEnd Admin Panel Debug Mode 🏠',
      'background: #4f46e5; color: white; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: bold;'
    );
    console.log(
      '%cCheck the groups above for detailed API call logs and error information.',
      'color: #6b7280; font-size: 12px;'
    );
  }, []);

  // This component doesn't render anything
  return null;
};

export default DebugInfo;