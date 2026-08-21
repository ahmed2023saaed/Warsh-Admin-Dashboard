// pages/SettingsPage.jsx

import { useState } from 'react';
import SettingsSection from '../components/UI/SettingsSection';
import SettingsRow from '../components/UI/SettingsRow';
import ToggleSwitch from '../components/ui/Toggle';

import {
  pricingSettings,
  catalogSettings,
  adminRoles,
} from '../data/settingsData';

export default function SettingsPage() {
  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    arabicRtl: true,
    emergencySos: true,
  });

  const updatePlatformSetting = (setting, value) => {
    setPlatformSettings((currentSettings) => ({
      ...currentSettings,
      [setting]: value,
    }));
  };

  const handleCatalogAction = (item) => {
    console.log('Manage:', item.id);

    // Later, navigate to the corresponding page:
    // navigate(`/settings/catalog/${item.id}`);
  };

  return (
    <div className="p-0 sm:p-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Pricing and commission */}
        <SettingsSection title="Pricing & Commission">
          {pricingSettings.map((setting) => (
            <SettingsRow
              key={setting.id}
              title={setting.title}
              description={setting.description}
              value={setting.value}
            />
          ))}
        </SettingsSection>

        {/* Catalog */}
        <SettingsSection title="Catalog">
          {catalogSettings.map((setting) => (
            <SettingsRow
              key={setting.id}
              title={setting.title}
              description={setting.description}
              action={
                setting.count !== undefined
                  ? `Manage (${setting.count})`
                  : 'Manage'
              }
              onAction={() => handleCatalogAction(setting)}
            />
          ))}
        </SettingsSection>

        {/* Platform */}
        <SettingsSection title="Platform">
          <SettingsRow
            title="App version"
            description="Current live version"
            value="1.4.2"
          />

          <SettingsRow
            title="Maintenance mode"
            description="Temporarily disable bookings"
          >
            <ToggleSwitch
              label="Maintenance mode"
              checked={platformSettings.maintenanceMode}
              onChange={(value) =>
                updatePlatformSetting('maintenanceMode', value)
              }
            />
          </SettingsRow>

          <SettingsRow
            title="Arabic / RTL"
            description="Default app language"
          >
            <ToggleSwitch
              label="Arabic and RTL mode"
              checked={platformSettings.arabicRtl}
              onChange={(value) =>
                updatePlatformSetting('arabicRtl', value)
              }
            />
          </SettingsRow>

          <SettingsRow
            title="Emergency SOS"
            description="Enable roadside requests"
          >
            <ToggleSwitch
              label="Emergency SOS"
              checked={platformSettings.emergencySos}
              onChange={(value) =>
                updatePlatformSetting('emergencySos', value)
              }
            />
          </SettingsRow>
        </SettingsSection>

        {/* Roles */}
        <SettingsSection title="Admin Roles & Permissions">
          {adminRoles.map((role) => (
            <SettingsRow
              key={role.id}
              title={role.title}
              description={role.description}
              value={`${role.users} ${
                role.users === 1 ? 'user' : 'users'
              }`}
            />
          ))}
        </SettingsSection>
      </div>
    </div>
  );
}
