import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function SystemConfig() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [config, setConfig] = useState({
    site: {
      name: 'EaseCart',
      description: 'Your one-stop e-commerce solution',
      logo: '',
      favicon: '',
      currency: 'USD',
      timezone: 'UTC',
      language: 'en',
      maintenanceMode: false,
      registrationEnabled: true,
      guestCheckout: true
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@easecart.com',
      fromName: 'EaseCart',
      emailVerification: true,
      orderNotifications: true,
      marketingEmails: false
    },
    payment: {
      stripePublicKey: '',
      stripeSecretKey: '',
      paypalClientId: '',
      paypalClientSecret: '',
      paymentMethods: ['card', 'paypal', 'bank-transfer'],
      currency: 'USD',
      taxRate: 10,
      shippingRate: 10,
      freeShippingThreshold: 100
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 6,
      requireEmailVerification: true,
      twoFactorAuth: false,
      ipWhitelist: [],
      allowedDomains: []
    },
    notifications: {
      newOrderNotification: true,
      lowStockNotification: true,
      systemMaintenanceNotification: true,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true
    },
    analytics: {
      googleAnalyticsId: '',
      facebookPixelId: '',
      trackingEnabled: true,
      cookieConsent: true,
      dataRetentionDays: 365
    }
  });

  const [activeTab, setActiveTab] = useState('site');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const tabs = [
    { id: 'site', name: 'Site Settings', icon: '🌐' },
    { id: 'email', name: 'Email Config', icon: '📧' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'analytics', name: 'Analytics', icon: '📊' }
  ];

  const handleChange = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, field, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    handleChange(section, field, arrayValue);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Configuration saved successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setMessage({ type: 'info', text: 'Configuration reset to defaults' });
    setIsEditing(false);
  };

  const renderSiteSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site Name
          </label>
          <input
            type="text"
            value={config.site.name}
            onChange={(e) => handleChange('site', 'name', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={config.site.currency}
            onChange={(e) => handleChange('site', 'currency', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Site Description
        </label>
        <textarea
          value={config.site.description}
          onChange={(e) => handleChange('site', 'description', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="input w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            value={config.site.timezone}
            onChange={(e) => handleChange('site', 'timezone', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={config.site.language}
            onChange={(e) => handleChange('site', 'language', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Site Features</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.site.maintenanceMode}
              onChange={(e) => handleChange('site', 'maintenanceMode', e.target.checked)}
              disabled={!isEditing}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Maintenance Mode</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.site.registrationEnabled}
              onChange={(e) => handleChange('site', 'registrationEnabled', e.target.checked)}
              disabled={!isEditing}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Allow User Registration</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.site.guestCheckout}
              onChange={(e) => handleChange('site', 'guestCheckout', e.target.checked)}
              disabled={!isEditing}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Allow Guest Checkout</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMTP Host
          </label>
          <input
            type="text"
            value={config.email.smtpHost}
            onChange={(e) => handleChange('email', 'smtpHost', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
            placeholder="smtp.gmail.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMTP Port
          </label>
          <input
            type="number"
            value={config.email.smtpPort}
            onChange={(e) => handleChange('email', 'smtpPort', parseInt(e.target.value))}
            disabled={!isEditing}
            className="input w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMTP Username
          </label>
          <input
            type="text"
            value={config.email.smtpUser}
            onChange={(e) => handleChange('email', 'smtpUser', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SMTP Password
          </label>
          <input
            type="password"
            value={config.email.smtpPassword}
            onChange={(e) => handleChange('email', 'smtpPassword', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Email
          </label>
          <input
            type="email"
            value={config.email.fromEmail}
            onChange={(e) => handleChange('email', 'fromEmail', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Name
          </label>
          <input
            type="text"
            value={config.email.fromName}
            onChange={(e) => handleChange('email', 'fromName', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Email Features</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.email.emailVerification}
            onChange={(e) => handleChange('email', 'emailVerification', e.target.checked)}
            disabled={!isEditing}
            className="mr-3"
          />
          <span className="text-sm text-gray-700">Email Verification Required</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.email.orderNotifications}
            onChange={(e) => handleChange('email', 'orderNotifications', e.target.checked)}
            disabled={!isEditing}
            className="mr-3"
          />
          <span className="text-sm text-gray-700">Order Notifications</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.email.marketingEmails}
            onChange={(e) => handleChange('email', 'marketingEmails', e.target.checked)}
            disabled={!isEditing}
            className="mr-3"
          />
          <span className="text-sm text-gray-700">Marketing Emails</span>
        </label>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stripe Public Key
          </label>
          <input
            type="text"
            value={config.payment.stripePublicKey}
            onChange={(e) => handleChange('payment', 'stripePublicKey', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
            placeholder="pk_test_..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stripe Secret Key
          </label>
          <input
            type="password"
            value={config.payment.stripeSecretKey}
            onChange={(e) => handleChange('payment', 'stripeSecretKey', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
            placeholder="sk_test_..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PayPal Client ID
          </label>
          <input
            type="text"
            value={config.payment.paypalClientId}
            onChange={(e) => handleChange('payment', 'paypalClientId', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PayPal Client Secret
          </label>
          <input
            type="password"
            value={config.payment.paypalClientSecret}
            onChange={(e) => handleChange('payment', 'paypalClientSecret', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={config.payment.taxRate}
            onChange={(e) => handleChange('payment', 'taxRate', parseFloat(e.target.value))}
            disabled={!isEditing}
            className="input w-full"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shipping Rate ($)
          </label>
          <input
            type="number"
            value={config.payment.shippingRate}
            onChange={(e) => handleChange('payment', 'shippingRate', parseFloat(e.target.value))}
            disabled={!isEditing}
            className="input w-full"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Free Shipping Threshold ($)
          </label>
          <input
            type="number"
            value={config.payment.freeShippingThreshold}
            onChange={(e) => handleChange('payment', 'freeShippingThreshold', parseFloat(e.target.value))}
            disabled={!isEditing}
            className="input w-full"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Methods
        </label>
        <input
          type="text"
          value={config.payment.paymentMethods.join(', ')}
          onChange={(e) => handleArrayChange('payment', 'paymentMethods', e.target.value)}
          disabled={!isEditing}
          className="input w-full"
          placeholder="card, paypal, bank-transfer"
        />
        <p className="text-xs text-gray-500 mt-1">Separate multiple methods with commas</p>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={config.security.sessionTimeout}
            onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
            disabled={!isEditing}
            className="input w-full"
            min="5"
            max="1440"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={config.security.maxLoginAttempts}
            onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            disabled={!isEditing}
            className="input w-full"
            min="3"
            max="10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password Minimum Length
        </label>
        <input
          type="number"
          value={config.security.passwordMinLength}
          onChange={(e) => handleChange('security', 'passwordMinLength', parseInt(e.target.value))}
          disabled={!isEditing}
          className="input w-full"
          min="6"
          max="50"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Security Features</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.security.requireEmailVerification}
            onChange={(e) => handleChange('security', 'requireEmailVerification', e.target.checked)}
            disabled={!isEditing}
            className="mr-3"
          />
          <span className="text-sm text-gray-700">Require Email Verification</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.security.twoFactorAuth}
            onChange={(e) => handleChange('security', 'twoFactorAuth', e.target.checked)}
            disabled={!isEditing}
            className="mr-3"
          />
          <span className="text-sm text-gray-700">Two-Factor Authentication</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          IP Whitelist
        </label>
        <input
          type="text"
          value={config.security.ipWhitelist.join(', ')}
          onChange={(e) => handleArrayChange('security', 'ipWhitelist', e.target.value)}
          disabled={!isEditing}
          className="input w-full"
          placeholder="192.168.1.1, 10.0.0.1"
        />
        <p className="text-xs text-gray-500 mt-1">Separate multiple IPs with commas</p>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Notification Types</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.notifications.newOrderNotification}
              onChange={(e) => handleChange('notifications', 'newOrderNotification', e.target.checked)}
              disabled={!isEditing}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">New Order Notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.notifications.lowStockNotification}
              onChange={(e) => handleChange('notifications', 'lowStockNotification', e.target.checked)}
              disabled={!isEditing}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Low Stock Notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.notifications.systemMaintenanceNotification}
              onChange={(e) => handleChange('notifications', 'systemMaintenanceNotification', e.target.checked)}
              disabled={!isEditing}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">System Maintenance Notifications</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Notification Channels</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.notifications.emailNotifications}
              onChange={(e) => handleChange('notifications', 'emailNotifications', e.target.checked)}
              disabled={!isEditing}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Email Notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.notifications.smsNotifications}
              onChange={(e) => handleChange('notifications', 'smsNotifications', e.target.checked)}
              disabled={!isEditing}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">SMS Notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.notifications.pushNotifications}
              onChange={(e) => handleChange('notifications', 'pushNotifications', e.target.checked)}
              disabled={!isEditing}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Push Notifications</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={config.analytics.googleAnalyticsId}
            onChange={(e) => handleChange('analytics', 'googleAnalyticsId', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
            placeholder="GA-XXXXXXXXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Facebook Pixel ID
          </label>
          <input
            type="text"
            value={config.analytics.facebookPixelId}
            onChange={(e) => handleChange('analytics', 'facebookPixelId', e.target.value)}
            disabled={!isEditing}
            className="input w-full"
            placeholder="123456789012345"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Retention (days)
        </label>
        <input
          type="number"
          value={config.analytics.dataRetentionDays}
          onChange={(e) => handleChange('analytics', 'dataRetentionDays', parseInt(e.target.value))}
          disabled={!isEditing}
          className="input w-full"
          min="30"
          max="3650"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Analytics Features</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.analytics.trackingEnabled}
            onChange={(e) => handleChange('analytics', 'trackingEnabled', e.target.checked)}
            disabled={!isEditing}
            className="mr-3"
          />
          <span className="text-sm text-gray-700">Enable Tracking</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.analytics.cookieConsent}
            onChange={(e) => handleChange('analytics', 'cookieConsent', e.target.checked)}
            disabled={!isEditing}
            className="mr-3"
          />
          <span className="text-sm text-gray-700">Cookie Consent Required</span>
        </label>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'site': return renderSiteSettings();
      case 'email': return renderEmailSettings();
      case 'payment': return renderPaymentSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'analytics': return renderAnalyticsSettings();
      default: return renderSiteSettings();
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container-px py-8">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access system configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-px py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
        <p className="text-gray-600 mt-2">Manage global system settings and preferences</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
          message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
          'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration Sections</h2>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h2>
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline"
                  >
                    Edit Settings
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleReset}
                      className="btn btn-outline"
                      disabled={isSaving}
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn btn-primary"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
