"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/app/admin/actions/settings";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { KhmerWarningBadge } from "@/components/admin/khmer-warning-badge";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Settings,
  Phone,
  Search,
  BarChart,
  ShieldAlert,
} from "lucide-react";
import type { SiteSettings } from "@prisma/client";

interface SettingsFormProps {
  initialSettings: SiteSettings | null;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"general" | "contact" | "seo" | "analytics" | "cookie">("general");
  const [langTab, setLangTab] = useState<"en" | "km">("en");
  const [isPending, setIsPending] = useState(false);

  // Form states
  const [logoLight, setLogoLight] = useState(initialSettings?.logoLight || "");
  const [logoDark, setLogoDark] = useState(initialSettings?.logoDark || "");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(
    initialSettings?.phoneNumbers && initialSettings.phoneNumbers.length > 0
      ? initialSettings.phoneNumbers
      : ["060 731 888", "099 200 076"]
  );
  const [email, setEmail] = useState(initialSettings?.email || "info@nostbakery.com");
  const [telegramLink, setTelegramLink] = useState(initialSettings?.telegramLink || "https://t.me/NostBakery");
  const [facebookLink, setFacebookLink] = useState(initialSettings?.facebookLink || "https://www.facebook.com/NOSTBakeryPastry");
  const [websiteUrl, setWebsiteUrl] = useState(initialSettings?.websiteUrl || "nostbakery.com");

  // Localized texts
  const [addressEn, setAddressEn] = useState(initialSettings?.addressEn || "Siem Reap, Cambodia");
  const [addressKm, setAddressKm] = useState(initialSettings?.addressKm || "");

  const [seoTitleEn, setSeoTitleEn] = useState(initialSettings?.seoTitleEn || "NOST Bakery & Pastry — Fresh Bakery in Siem Reap");
  const [seoTitleKm, setSeoTitleKm] = useState(initialSettings?.seoTitleKm || "");
  const [seoDescriptionEn, setSeoDescriptionEn] = useState(initialSettings?.seoDescriptionEn || "Fresh bread, pastries, cakes and desserts in Siem Reap, Cambodia.");
  const [seoDescriptionKm, setSeoDescriptionKm] = useState(initialSettings?.seoDescriptionKm || "");
  const [ogImage, setOgImage] = useState(initialSettings?.ogImage || "");

  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(initialSettings?.googleAnalyticsId || "");
  const [facebookPixelId, setFacebookPixelId] = useState(initialSettings?.facebookPixelId || "");

  const [cookieNoticeTextEn, setCookieNoticeTextEn] = useState(
    initialSettings?.cookieNoticeTextEn || "We use cookies to improve your experience. By continuing, you agree to our use of cookies."
  );
  const [cookieNoticeTextKm, setCookieNoticeTextKm] = useState(initialSettings?.cookieNoticeTextKm || "");

  const [footerTextEn, setFooterTextEn] = useState(initialSettings?.footerTextEn || "Baked with love in Siem Reap.");
  const [footerTextKm, setFooterTextKm] = useState(initialSettings?.footerTextKm || "");

  const handleAddPhone = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const handlePhoneChange = (index: number, val: string) => {
    const updated = [...phoneNumbers];
    updated[index] = val;
    setPhoneNumbers(updated);
  };

  const handleRemovePhone = (index: number) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const res = await updateSiteSettings({
        logoLight: logoLight || null,
        logoDark: logoDark || null,
        phoneNumbers: phoneNumbers.filter((p) => p.trim().length > 0),
        email,
        telegramLink,
        facebookLink,
        websiteUrl,
        addressEn,
        addressKm,
        seoTitleEn,
        seoTitleKm,
        seoDescriptionEn,
        seoDescriptionKm,
        ogImage: ogImage || null,
        googleAnalyticsId: googleAnalyticsId || null,
        facebookPixelId: facebookPixelId || null,
        cookieNoticeTextEn,
        cookieNoticeTextKm,
        footerTextEn,
        footerTextKm,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to update settings");
      } else {
        toast.success("Site settings updated successfully!");
      }
    } catch {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-[#F1E6D4] border border-[#C98A3D]/20 shadow-xs">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "general", label: "General", icon: Settings },
            { id: "contact", label: "Contact & Links", icon: Phone },
            { id: "seo", label: "Global SEO", icon: Search },
            { id: "analytics", label: "Analytics & Pixels", icon: BarChart },
            { id: "cookie", label: "Cookie & Legal", icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[#3A2418] text-[#FBF7F1] shadow-xs"
                    : "text-[#3A2418]/70 hover:text-[#3A2418] hover:bg-[#FBF7F1]/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[#C98A3D] hover:bg-[#A66A2A] text-[#FBF7F1] font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes…</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Site Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Language switcher for content tabs */}
      {(activeTab === "general" || activeTab === "contact" || activeTab === "seo" || activeTab === "cookie") && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]/70">
            Field Translation Language:
          </span>
          <LanguageTabs
            activeTab={langTab}
            onChange={setLangTab}
            hasKmValue={Boolean(addressKm && seoTitleKm && cookieNoticeTextKm && footerTextKm)}
          />
        </div>
      )}

      {/* Tab 1: General */}
      {activeTab === "general" && (
        <div className="p-6 bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 space-y-6 shadow-xs">
          <h2 className="text-base font-bold font-serif text-[#3A2418]">
            General Branding & Footer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Logo Light (on dark background)"
              value={logoLight}
              onChange={setLogoLight}
              placeholderText="NOST Logo Light"
              helperText="Used on dark header/footer elements"
            />

            <ImageUpload
              label="Logo Dark (on light background)"
              value={logoDark}
              onChange={setLogoDark}
              placeholderText="NOST Logo Dark"
              helperText="Primary logo used on main warm-white background"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-[#3A2418]/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                Footer Tagline ({langTab.toUpperCase()})
              </label>
              {langTab === "km" && <KhmerWarningBadge value={footerTextKm} />}
            </div>

            {langTab === "en" ? (
              <input
                type="text"
                value={footerTextEn}
                onChange={(e) => setFooterTextEn(e.target.value)}
                placeholder="Baked with love in Siem Reap."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
            ) : (
              <input
                type="text"
                value={footerTextKm}
                onChange={(e) => setFooterTextKm(e.target.value)}
                placeholder="ដុតនំដោយក្តីស្រលាញ់នៅក្រុងសៀមរាប"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Contact & Links */}
      {activeTab === "contact" && (
        <div className="p-6 bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 space-y-6 shadow-xs">
          <h2 className="text-base font-bold font-serif text-[#3A2418]">
            Contact Channels & Social Media
          </h2>

          {/* Dynamic Phone Numbers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                Phone Numbers
              </label>
              <button
                type="button"
                onClick={handleAddPhone}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#A66A2A] hover:text-[#3A2418]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Number</span>
              </button>
            </div>

            <div className="space-y-2">
              {phoneNumbers.map((phone, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                    placeholder="060 731 888"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
                  />
                  {phoneNumbers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(idx)}
                      className="p-2 text-[#9E3B3B] hover:bg-[#9E3B3B]/10 rounded-lg transition-colors"
                      title="Remove phone number"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#3A2418]/10">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A2418] mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A2418] mb-1.5">
                Website Domain
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="nostbakery.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A2418] mb-1.5">
                Telegram Channel / Direct Link
              </label>
              <input
                type="url"
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                placeholder="https://t.me/NostBakery"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A2418] mb-1.5">
                Facebook Page Link
              </label>
              <input
                type="url"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                placeholder="https://www.facebook.com/NOSTBakeryPastry"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#3A2418]/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                Headquarters Address ({langTab.toUpperCase()})
              </label>
              {langTab === "km" && <KhmerWarningBadge value={addressKm} />}
            </div>

            {langTab === "en" ? (
              <textarea
                rows={2}
                value={addressEn}
                onChange={(e) => setAddressEn(e.target.value)}
                placeholder="Siem Reap, Cambodia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
            ) : (
              <textarea
                rows={2}
                value={addressKm}
                onChange={(e) => setAddressKm(e.target.value)}
                placeholder="សៀមរាប, កម្ពុជា"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Global SEO */}
      {activeTab === "seo" && (
        <div className="p-6 bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 space-y-6 shadow-xs">
          <h2 className="text-base font-bold font-serif text-[#3A2418]">
            Default Global Search Engine Optimization
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                  Default SEO Title ({langTab.toUpperCase()})
                </label>
                {langTab === "km" && <KhmerWarningBadge value={seoTitleKm} />}
              </div>
              {langTab === "en" ? (
                <input
                  type="text"
                  value={seoTitleEn}
                  onChange={(e) => setSeoTitleEn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
                />
              ) : (
                <input
                  type="text"
                  value={seoTitleKm}
                  onChange={(e) => setSeoTitleKm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                  Default Meta Description ({langTab.toUpperCase()})
                </label>
                {langTab === "km" && <KhmerWarningBadge value={seoDescriptionKm} />}
              </div>
              {langTab === "en" ? (
                <textarea
                  rows={3}
                  value={seoDescriptionEn}
                  onChange={(e) => setSeoDescriptionEn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
                />
              ) : (
                <textarea
                  rows={3}
                  value={seoDescriptionKm}
                  onChange={(e) => setSeoDescriptionKm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
                />
              )}
            </div>

            <div className="pt-3 border-t border-[#3A2418]/10">
              <ImageUpload
                label="Global OpenGraph Share Image (OG)"
                value={ogImage}
                onChange={setOgImage}
                placeholderText="NOST Bakery OpenGraph"
                helperText="Recommended dimension: 1200 x 630 px. Shown when sharing website on Facebook/Telegram."
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Analytics & Pixels */}
      {activeTab === "analytics" && (
        <div className="p-6 bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 space-y-6 shadow-xs">
          <h2 className="text-base font-bold font-serif text-[#3A2418]">
            Tracking & Marketing Pixels
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A2418] mb-1.5">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
              <p className="text-[11px] text-[#3A2418]/60 mt-1">
                Found in your Google Analytics Admin &gt; Data Streams.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3A2418] mb-1.5">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                value={facebookPixelId}
                onChange={(e) => setFacebookPixelId(e.target.value)}
                placeholder="123456789012345"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
              <p className="text-[11px] text-[#3A2418]/60 mt-1">
                Your Meta Business Pixel ID for campaign conversion tracking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Cookie & Legal */}
      {activeTab === "cookie" && (
        <div className="p-6 bg-[#F1E6D4] rounded-2xl border border-[#C98A3D]/20 space-y-6 shadow-xs">
          <h2 className="text-base font-bold font-serif text-[#3A2418]">
            Cookie Notice & Privacy Banner
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3A2418]">
                Cookie Consent Banner Message ({langTab.toUpperCase()})
              </label>
              {langTab === "km" && <KhmerWarningBadge value={cookieNoticeTextKm} />}
            </div>

            {langTab === "en" ? (
              <textarea
                rows={3}
                value={cookieNoticeTextEn}
                onChange={(e) => setCookieNoticeTextEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
            ) : (
              <textarea
                rows={3}
                value={cookieNoticeTextKm}
                onChange={(e) => setCookieNoticeTextKm(e.target.value)}
                placeholder="យើងប្រើប្រាស់ខូគីដើម្បីកែលម្អបទពិសោធន៍របស់អ្នកនៅលើគេហទំព័រនេះ។"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF7F1] border border-[#C98A3D]/30 text-sm text-[#3A2418] focus:outline-none focus:ring-2 focus:ring-[#C98A3D]"
              />
            )}
          </div>
        </div>
      )}
    </form>
  );
}
