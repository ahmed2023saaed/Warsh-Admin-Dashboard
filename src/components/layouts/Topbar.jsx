import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";
import Input from "../UI/Input";
import { useLocation } from "react-router-dom";
import topbarMock from "../../Data/topbarMock.json";
import reviewsMock from "../../Data/reviewsMock.json";

function capitalizeWords(value) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getInitials(value) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
/***************** */
export default function Topbar({ onMenuOpen }) {
  const [searchValue, setSearchValue] = useState("");
  const userName = "saif Fawzy";
  const userRole = "Super Admin";
  const formattedUserName = capitalizeWords(userName);
  const userInitials = getInitials(userName);

  const location = useLocation();

  function pageDtails() {
    const pageRout = location.pathname.split("/").filter(Boolean).pop();

    const pageKey =
      pageRout === "en" || pageRout === "ar"
        ? "Dashboard"
        : pageRout
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join("");

    return topbarMock[pageKey] || ["Page Not Found", ""];
  }

  const [pageTitle, defaultPageInfo] = pageDtails();
  const PageInfo =
    pageTitle === "Reviews"
      ? `${reviewsMock.reviews.length.toLocaleString()} customer reviews across all centers`
      : defaultPageInfo;
  const currentRoute = location.pathname.split("/").filter(Boolean).pop();
  const isDashboard = ["en", "ar", "dashboard"].includes(
    currentRoute?.toLowerCase(),
  );

  function getFormattedDate() {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  }

  const today = getFormattedDate();

  /***************** */
  return (
    <header className="flex min-h-[72px] shrink-0 items-center justify-between gap-3 border-b border-[#E8E2D8] bg-[#F6F3EE] px-3 py-3 sm:px-6 lg:px-8 lg:py-5">
      {/* Current page name and its supporting information. */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E8E2D8] bg-white text-[#1C1712] transition-colors hover:border-[#E08B2F] hover:text-[#E08B2F] lg:hidden"
        >
          <Menu aria-hidden="true" size={21} />
        </button>
        <div className="min-w-0">
        <h1 className="truncate text-lg font-extrabold leading-tight tracking-[-0.01em] text-[#1C1712] sm:text-[22px]">
          {pageTitle}
        </h1>
        <p className="mt-1 hidden truncate text-[14.5px] text-[#8A8074] sm:block">
          {isDashboard ? `${PageInfo} · ${today}` : PageInfo}
        </p>
        </div>
      </div>

      {/* Search, notifications, and the signed-in admin. */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-[14px]">
        <Input
          ID="global-search"
          placeholder="Search anything..."
          icon={Search}
          dimensions={{ width: "240px", height: "42px" }}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="hidden xl:flex"
        />

        <button
          type="button"
          aria-label="Open notifications"
          className="relative flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-[11px] border border-[#E8E2D8] bg-white text-[#1C1712] transition-colors hover:border-[#E08B2F] hover:text-[#E08B2F]"
        >
          <Bell size={18} strokeWidth={2} />
          <span className="absolute right-[9px] top-2 h-[7px] w-[7px] rounded-full bg-[#D9534F]" />
        </button>

        <div className="flex items-center gap-[9px]">
          {/* Generated from the first letter of every word in userName. */}
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#E08B2F] to-[#C8730A] text-sm font-bold text-white"
          >
            {userInitials}
          </div>

          <div className="hidden md:block">
            <h3 className="text-sm font-bold leading-[1.2] text-[#1C1712]">
              {formattedUserName}
            </h3>
            <p className="mt-0.5 text-xs text-[#8A8074]">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
