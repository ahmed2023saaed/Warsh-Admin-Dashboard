// pages/SettingsPage.jsx

import { useState } from 'react';
import Button from '../components/UI/Button';
import SettingsSection from '../components/UI/SettingsSection';
import SettingsRow from '../components/UI/SettingsRow';
import ToggleSwitch from '../components/UI/Toggle';

import { pricingSettings, catalogSettings, adminRoles } from '../Data/settingsData';

export default function SettingsPage() {
  const [pricingValues, setPricingValues] = useState(() =>
    Object.fromEntries(pricingSettings.map(({ id, amount }) => [id, String(amount)]))
  );
  const [pricingDraft, setPricingDraft] = useState(null);
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

  const beginPricingEdit = () => setPricingDraft({ ...pricingValues });

  const cancelPricingEdit = () => setPricingDraft(null);

  const savePricingEdit = () => {
    setPricingValues(pricingDraft);
    setPricingDraft(null);
  };

  const updatePricingValue = (setting, value) => {
    setPricingDraft((currentValues) => ({ ...currentValues, [setting]: value }));
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
        <SettingsSection
          title="Pricing & Commission"
          headerAction={
            pricingDraft ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={savePricingEdit}
                  className="rounded-lg bg-[#E08B2F] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#C8730A]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelPricingEdit}
                  className="rounded-lg border border-[#E4DCD2] px-3 py-1.5 text-xs font-semibold text-[#6F6258] transition hover:bg-[#F6F3EE]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <Button
                onClick={beginPricingEdit}
                className="!border-[#E08B2F] !bg-[#E08B2F] !px-4 !py-2 !text-sm !text-white shadow-[0_4px_12px_rgba(224,139,47,0.24)] hover:!border-[#C8730A] hover:!bg-[#C8730A] hover:shadow-[0_6px_16px_rgba(200,115,10,0.28)]"
              >
                Edit
              </Button>
            )
          }
        >
          {pricingSettings.map((setting) => (
            <SettingsRow
              key={setting.id}
              title={setting.title}
              description={setting.description}
            >
              {pricingDraft ? (
                <div className="flex items-center gap-2">
                  <input
                    aria-label={setting.title}
                    type="number"
                    min="0"
                    step="any"
                    value={pricingDraft[setting.id]}
                    onChange={(event) => updatePricingValue(setting.id, event.target.value)}
                    className="h-9 w-24 rounded-lg border border-[#E4DCD2] bg-white px-3 text-right text-sm font-bold text-[#17120E] outline-none transition focus:border-[#E08B2F] focus:ring-2 focus:ring-[#E08B2F]/20"
                  />
                  <span className="min-w-12 text-right text-sm font-bold text-[#17120E]">
                    {setting.unit}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-bold whitespace-nowrap text-[#17120E]">
                  {Number(pricingValues[setting.id]).toLocaleString('en-US')}
                  {setting.unit === '%' ? setting.unit : ` ${setting.unit}`}
                </span>
              )}
            </SettingsRow>
          ))}
        </SettingsSection>

        {/* Catalog */}
        <SettingsSection title="Catalog">
          {catalogSettings.map((setting) => (
            <SettingsRow
              key={setting.id}
              title={setting.title}
              description={setting.description}
              action={setting.count !== undefined ? `Manage (${setting.count})` : 'Manage'}
              onAction={() => handleCatalogAction(setting)}
            />
          ))}
        </SettingsSection>

        {/* Platform */}
        <SettingsSection title="Platform">
          <SettingsRow title="App version" description="Current live version" value="1.4.2" />

          <SettingsRow title="Maintenance mode" description="Temporarily disable bookings">
            <ToggleSwitch
              label="Maintenance mode"
              checked={platformSettings.maintenanceMode}
              onChange={(value) => updatePlatformSetting('maintenanceMode', value)}
            />
          </SettingsRow>

          <SettingsRow title="Arabic / RTL" description="Default app language">
            <ToggleSwitch
              label="Arabic and RTL mode"
              checked={platformSettings.arabicRtl}
              onChange={(value) => updatePlatformSetting('arabicRtl', value)}
            />
          </SettingsRow>

          <SettingsRow title="Emergency SOS" description="Enable roadside requests">
            <ToggleSwitch
              label="Emergency SOS"
              checked={platformSettings.emergencySos}
              onChange={(value) => updatePlatformSetting('emergencySos', value)}
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
              value={`${role.users} ${role.users === 1 ? 'user' : 'users'}`}
            />
          ))}
        </SettingsSection>
      </div>
    </div>
  );
}
